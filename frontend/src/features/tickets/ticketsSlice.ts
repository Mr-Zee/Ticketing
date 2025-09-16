
import { createSlice, createEntityAdapter, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
export type Ticket = {
  id: string
  title: string
  status: 'OPEN'|'PENDING'|'RESOLVED'|'CLOSED'
  priority: 'LOW'|'MEDIUM'|'HIGH'|'URGENT'
  assignee?: string|null
  tags?: string[]
  createdAt: string
  updatedAt: string
  description?: string
}


const adapter = createEntityAdapter<Ticket>({ selectId: (t) => t.id })

export const fetchTickets = createAsyncThunk('tickets/fetch', async () => {
  const now = Date.now()
  const root = localStorage.getItem('persist:root')
  if (root) {
    try {
      const parsed = JSON.parse(root)
      if (parsed.tickets) {
        // tickets slice is stringified inside persist root
        const slice = JSON.parse(parsed.tickets) as { entities?: Record<string, Ticket> }
        const existing = Object.values(slice.entities ?? {})
        if (existing.length) return existing
      }
    } catch { /* ignore */ }
  }
  return [
    { id: 'T-101', title: 'Unable to access dashboard', status: 'OPEN',     priority: 'HIGH',   assignee: 'Sarah Wilson', tags:['auth','ui'],    createdAt: new Date(now-86400000*3).toISOString(), updatedAt: new Date(now-3600000).toISOString(), description: 'User cannot access dashboard after login.' },
    { id: 'T-102', title: 'Dark mode request',          status: 'PENDING',  priority: 'MEDIUM', assignee: 'Mike Chen',    tags:['feature'],      createdAt: new Date(now-86400000*2).toISOString(), updatedAt: new Date(now-7200000).toISOString(), description: 'Add dark mode toggle.' },
    { id: 'T-103', title: 'Payment failing on Safari',  status: 'RESOLVED', priority: 'URGENT', assignee: 'Sarah Wilson', tags:['payments','safari'], createdAt: new Date(now-86400000*5).toISOString(), updatedAt: new Date(now-86400000).toISOString(), description: 'Stripe payment fails on Safari 16.' },
    { id: 'T-104', title: 'Mobile layout glitch',       status: 'OPEN',     priority: 'LOW',    assignee: null,           tags:['mobile','ui'],  createdAt: new Date(now-86400000*1).toISOString(), updatedAt: new Date(now-5400000).toISOString(), description: 'Cards overflow on small screens.' },
    { id: 'T-105', title: 'Webhook 500 error',          status: 'PENDING',  priority: 'HIGH',   assignee: 'Raj Patel',    tags:['backend','webhook'], createdAt: new Date(now-86400000*7).toISOString(), updatedAt: new Date(now-300000).toISOString(), description: 'Webhook 500 due to schema mismatch.' }
  ] as Ticket[]
})
const slice = createSlice({
  name: 'tickets',
  initialState: adapter.getInitialState({ loading: false }),
  reducers: {
    simulateUpdate: (s, a: PayloadAction<{ id: string; status: Ticket['status'] }>) => {
      const { id, status } = a.payload; adapter.updateOne(s, { id, changes: { status, updatedAt: new Date().toISOString() } })
    },
    updateTicket: (s, a: PayloadAction<{ id: string; changes: Partial<Ticket> }>) => {
      adapter.updateOne(s, a.payload)
    },
    addTicket: (s, a: PayloadAction<Ticket>) => { adapter.addOne(s, a.payload) }
  },
  extraReducers: (b) => {
    b.addCase(fetchTickets.pending, (s) => { s.loading = true })
     .addCase(fetchTickets.fulfilled, (s, a) => { s.loading = false; adapter.setAll(s, a.payload) })
     .addCase(fetchTickets.rejected, (s) => { s.loading = false })
  }
})
export const { simulateUpdate, updateTicket, addTicket } = slice.actions
export const ticketsSelectors = adapter.getSelectors((state: any) => state.tickets)
export default slice.reducer
