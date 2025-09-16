
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { v4 as uuid } from 'uuid'
// @ts-ignore
import StompServer from 'stomp-broker-js'

const PORT = Number(process.env.PORT || 8080)
const WS_PATH = process.env.WS_PATH || '/ws'
const SEED_ON_START = String(process.env.SEED_ON_START || 'true') === 'true'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

const server = http.createServer(app)
const stompServer = new StompServer({ server, path: WS_PATH })

type Ticket = {
  id: string
  title: string
  status: 'OPEN'|'PENDING'|'RESOLVED'|'CLOSED'
  priority: 'LOW'|'MEDIUM'|'HIGH'|'URGENT'
  assignee?: string | null
  tags?: string[]
  createdAt: string
  updatedAt: string
  description?: string
}
const tickets = new Map<string, Ticket>()

function publish(topic: string, data: any) {
  const body = JSON.stringify(data)
  stompServer.send(topic, {}, body)
  console.log('→ sent', topic, body)
}

function seedTickets() {
  const now = Date.now()
  const seed: Ticket[] = [
    { id: 'T-901', title: 'Seed: Dashboard access issue', status: 'OPEN', priority: 'HIGH', assignee: 'Sarah Wilson', tags: ['auth','ui'], createdAt: new Date(now-86400000*3).toISOString(), updatedAt: new Date(now-3600000).toISOString(), description: 'User cannot access dashboard after login.' },
    { id: 'T-902', title: 'Seed: Dark mode request', status: 'PENDING', priority: 'MEDIUM', assignee: 'Mike Chen', tags: ['feature'], createdAt: new Date(now-86400000*2).toISOString(), updatedAt: new Date(now-7200000).toISOString(), description: 'Add dark mode toggle.' },
    { id: 'T-903', title: 'Seed: Payment failing on Safari', status: 'RESOLVED', priority: 'URGENT', assignee: 'Sarah Wilson', tags: ['payments','safari'], createdAt: new Date(now-86400000*5).toISOString(), updatedAt: new Date(now-86400000).toISOString(), description: 'Stripe payment fails on Safari 16.' }
  ]
  for (const t of seed) {
    tickets.set(t.id, t)
    publish('/topic/tickets.new', { ticket: t })
  }
}

app.post('/api/tickets', (req, res) => {
  const now = new Date().toISOString()
  const id = req.body?.id || `T-${Math.floor(Math.random() * 900 + 100)}`
  const t: Ticket = {
    id,
    title: req.body?.title || 'New ticket',
    status: req.body?.status || 'OPEN',
    priority: req.body?.priority || 'LOW',
    assignee: req.body?.assignee ?? null,
    tags: req.body?.tags ?? [],
    createdAt: now,
    updatedAt: now,
    description: req.body?.description ?? ''
  }
  tickets.set(id, t)
  publish('/topic/tickets.new', { ticket: t })
  res.json({ ok: true, ticket: t })
})

app.post('/api/tickets/:id', (req, res) => {
  const id = req.params.id
  const prev = tickets.get(id)
  const changes = req.body?.changes || {}
  if (!prev) return res.status(404).json({ error: 'Not found' })
  const updated: Ticket = { ...prev, ...changes, updatedAt: new Date().toISOString() }
  tickets.set(id, updated)
  publish('/topic/tickets.updated', { id, changes })
  res.json({ ok: true, ticket: updated })
})

app.post('/api/tickets/:id/messages', (req, res) => {
  const id = req.params.id
  if (!tickets.has(id)) return res.status(404).json({ error: 'Not found' })
  const payload = {
    ticketId: id,
    sender: req.body?.sender || 'User',
    body: req.body?.body || '',
    attachments: req.body?.attachments || []
  }
  publish(`/topic/tickets.${id}.messages.new`, payload)
  res.json({ ok: true })
})

app.get('/health', (_req, res) => res.json({ ok: true }))

// random demo events
setInterval(() => {
  if (tickets.size === 0) return
  const ids = Array.from(tickets.keys())
  const id = ids[Math.floor(Math.random() * ids.length)]
  const statuses: Ticket['status'][] = ['OPEN','PENDING','RESOLVED','CLOSED']
  const next = statuses[Math.floor(Math.random() * statuses.length)]
  publish('/topic/tickets.updated', { id, changes: { status: next } })
  publish(`/topic/tickets.${id}.messages.new`, {
    ticketId: id,
    sender: 'System',
    body: `Status changed to ${next}`
  })
}, 15000)

server.listen(PORT, () => {
  console.log(`HTTP listening on http://localhost:${PORT}`)
  console.log(`STOMP over WS at ws://localhost:${PORT}${WS_PATH}`)
  if (SEED_ON_START) {
    console.log('Seeding demo tickets...')
    setTimeout(seedTickets, 1000)
  }
})
