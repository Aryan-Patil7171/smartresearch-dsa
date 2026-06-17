import React from 'react'

export default function Filters({ onChange, values = {} }){
  return (
    <div className="filters">
      <label style={{marginRight:8}}>Search:
        <input defaultValue={values.search||''} onChange={e => onChange && onChange({ search: e.target.value })} />
      </label>
      <label style={{marginLeft:12}}>Priority:
        <select defaultValue={values.priority||''} onChange={e => onChange && onChange({ priority: e.target.value })}>
          <option value="">Any</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </label>
    </div>
  )
}
