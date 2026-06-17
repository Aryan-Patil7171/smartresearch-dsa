import { defineConfig } from 'vite'

export default async () => {
  // Dynamically import the ESM-only plugin to avoid Node attempting to `require` it.
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return defineConfig({
    plugins: [reactPlugin()],
    server: { port: 5174,
      proxy: {
        // proxy any /api requests to the backend server
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, '/api')
        }
      }
    }
  })
}
