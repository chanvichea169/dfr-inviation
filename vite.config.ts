import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only middleware so `npm run dev` (plain Vite) can serve /api/invitation.
// In production, Vercel serves api/invitation.ts as a serverless function instead.
function invitationApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'invitation-api-dev',
    apply: 'serve',
    configureServer(server) {
      // Make Sheety configuration from .env available to the shared helper.
      if (env.SHEETY_BEARER_TOKEN) process.env.SHEETY_BEARER_TOKEN ||= env.SHEETY_BEARER_TOKEN

      server.middlewares.use('/api/invitation', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }))
          return
        }

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const raw = Buffer.concat(chunks).toString('utf-8')
          const body = raw ? JSON.parse(raw) : {}

          const { appendInvitation } = await server.ssrLoadModule('/api/_sheets.ts')
          const result = await appendInvitation(body)

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, id: result.id }))
        } catch (error: any) {
          console.error('Invitation API Error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: error?.message || 'Failed to append data' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), invitationApiPlugin(env)],
  }
})
