import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const projectId = env.VITE_SANITY_PROJECT_ID || 'pdvy8mfz'
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/sanity-api': {
          target: `https://${projectId}.api.sanity.io`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sanity-api/, ''),
          bypass(req, res) {
            if (
              req.method !== 'GET' ||
              !/^\/sanity-api\/v[\d-]+\/data\/query\//.test(req.url)
            ) {
              res.writeHead(405)
              res.end('Only public content queries are supported.')
              return false
            }
          },
          configure(proxy) {
            proxy.on('proxyReq', (request) => {
              request.removeHeader('origin')
              request.removeHeader('cookie')
              request.removeHeader('authorization')
            })
          },
        },
      },
    },
    build: { outDir: 'dist' },
  }
})
