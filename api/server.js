const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const ROOT = path.resolve(__dirname, '..')
const R_FILE = path.join(ROOT, 'researchers.txt')
const P_FILE = path.join(ROOT, 'projects.txt')
const D_FILE = path.join(ROOT, 'documents.txt')
const REQ_FILE = path.join(ROOT, 'requests.txt')
const COL_FILE = path.join(ROOT, 'collaborations.txt')

function safeRead(file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch (e) {
    return ''
  }
}

function parseResearchers() {
  const out = []
  const txt = safeRead(R_FILE)
  txt.split(/\r?\n/).forEach(line => {
    line = line.trim()
    if (!line) return
    const parts = line.split('|')
    if (parts.length >= 3) out.push({ id: parseInt(parts[0],10), name: parts[1], department: parts[2] })
  })
  return out
}

function parseProjects() {
  const out = []
  const txt = safeRead(P_FILE)
  txt.split(/\r?\n/).forEach(line => {
    line = line.trim()
    if (!line) return
    const parts = line.split('|')
    if (parts.length >= 4) out.push({ id: parseInt(parts[0],10), title: parts[1], priority: parts[2], status: parts[3] })
  })
  return out
}

function writeResearchers(list) {
  const data = list.map(r => `${r.id}|${r.name}|${r.department}`).join('\n') + '\n'
  fs.writeFileSync(R_FILE, data)
}

function writeProjects(list) {
  const data = list.map(p => `${p.id}|${p.title}|${p.priority}|${p.status}`).join('\n') + '\n'
  fs.writeFileSync(P_FILE, data)
}

function parseDocuments() {
  const map = {}
  const txt = safeRead(D_FILE)
  txt.split(/\r?\n/).forEach(line => {
    line = line.trim(); if (!line) return
    const i = line.indexOf('|');
    if (i === -1) return
    const id = parseInt(line.slice(0,i),10)
    const rest = line.slice(i+1)
    const revs = rest ? rest.split('~') : []
    map[id] = revs
  })
  return map
}

function writeDocuments(map) {
  const lines = []
  for (const [id, revs] of Object.entries(map)) {
    lines.push(`${id}|${revs.join('~')}`)
  }
  fs.writeFileSync(D_FILE, lines.join('\n') + '\n')
}

function parseRequests() {
  const out = []
  const txt = safeRead(REQ_FILE)
  txt.split(/\r?\n/).forEach(line => {
    line = line.trim(); if (!line) return
    const parts = line.split('|')
    out.push({ requesterId: parseInt(parts[0],10), projectId: parseInt(parts[1],10), message: parts.slice(2).join('|') })
  })
  return out
}

function writeRequests(list) {
  const data = list.map(r => `${r.requesterId}|${r.projectId}|${r.message}`).join('\n') + '\n'
  fs.writeFileSync(REQ_FILE, data)
}

function parseCollaborations() {
  const out = []
  const txt = safeRead(COL_FILE)
  txt.split(/\r?\n/).forEach(line => {
    line = line.trim(); if (!line) return
    const parts = line.split(',')
    out.push({ a: parseInt(parts[0],10), b: parseInt(parts[1],10) })
  })
  return out
}

function writeCollaborations(list) {
  const data = list.map(e => `${e.a},${e.b}`).join('\n') + '\n'
  fs.writeFileSync(COL_FILE, data)
}

// API endpoints

app.get('/api/researchers', (req,res) => res.json(parseResearchers()))

app.post('/api/researchers', (req,res) => {
  const body = req.body
  if (!body || !body.id || !body.name) return res.status(400).json({ error: 'id and name required' })
  const list = parseResearchers()
  if (list.find(r => r.id === body.id)) return res.status(400).json({ error: 'duplicate id' })
  list.push({ id: body.id, name: body.name, department: body.department || '' })
  writeResearchers(list)
  res.json({ ok: true })
})

app.get('/api/projects', (req,res) => res.json(parseProjects()))

app.post('/api/projects', (req,res) => {
  const body = req.body
  if (!body || !body.id || !body.title) return res.status(400).json({ error: 'id and title required' })
  const list = parseProjects()
  if (list.find(p => p.id === body.id)) return res.status(400).json({ error: 'duplicate id' })
  list.push({ id: body.id, title: body.title, priority: body.priority || 'Low', status: body.status || 'Active' })
  writeProjects(list)
  res.json({ ok: true })
})

app.delete('/api/projects/:id', (req,res) => {
  const id = parseInt(req.params.id,10)
  let list = parseProjects()
  const before = list.length
  list = list.filter(p => p.id !== id)
  writeProjects(list)
  res.json({ deleted: before - list.length })
})

app.get('/api/documents/:projectId', (req,res) => {
  const pid = parseInt(req.params.projectId,10)
  const map = parseDocuments()
  res.json(map[pid] || [])
})

app.post('/api/documents/:projectId', (req,res) => {
  const pid = parseInt(req.params.projectId,10)
  const body = req.body
  if (!body || !body.content) return res.status(400).json({ error: 'content required' })
  const map = parseDocuments()
  if (!map[pid]) map[pid] = []
  map[pid].push(body.content)
  writeDocuments(map)
  res.json({ ok: true })
})

app.delete('/api/documents/:projectId', (req,res) => {
  const pid = parseInt(req.params.projectId,10)
  const map = parseDocuments()
  if (!map[pid] || map[pid].length === 0) return res.status(400).json({ error: 'no revisions' })
  map[pid].pop()
  writeDocuments(map)
  res.json({ ok: true })
})

app.get('/api/requests', (req,res) => res.json(parseRequests()))

app.post('/api/requests', (req,res) => {
  const body = req.body
  if (!body || !body.requesterId || !body.projectId) return res.status(400).json({ error: 'requesterId and projectId required' })
  const list = parseRequests()
  list.push({ requesterId: body.requesterId, projectId: body.projectId, message: body.message || '' })
  writeRequests(list)
  res.json({ ok: true })
})

app.post('/api/requests/process', (req,res) => {
  const list = parseRequests()
  if (list.length === 0) return res.status(400).json({ error: 'no requests' })
  const reqItem = list.shift()
  writeRequests(list)
  // make collaboration: connect requester to first researcher if exists
  const coll = parseCollaborations()
  coll.push({ a: reqItem.requesterId, b: reqItem.projectId })
  writeCollaborations(coll)
  res.json({ processed: reqItem })
})

app.get('/api/collaborations', (req,res) => res.json(parseCollaborations()))
app.post('/api/collaborations', (req,res) => {
  const b = req.body
  if (!b || !b.a || !b.b) return res.status(400).json({ error: 'a and b required' })
  const coll = parseCollaborations()
  coll.push({ a: b.a, b: b.b })
  writeCollaborations(coll)
  res.json({ ok: true })
})

// serve static frontend
app.use('/', express.static(path.join(ROOT, 'frontend')))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`ResearchHub API listening on http://localhost:${PORT}`))
