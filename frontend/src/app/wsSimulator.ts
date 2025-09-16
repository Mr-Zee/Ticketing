
import type { Middleware } from '@reduxjs/toolkit'
export const wsSimulator: Middleware = (store) => {
  let timer: any
  return (next) => (action) => {
    const result = next(action)
    const state: any = store.getState()
    if (state.auth.user && !timer) {
      timer = setInterval(() => {
        const ids: string[] = state.tickets.ids || []
        if (ids.length) {
          const id = ids[Math.floor(Math.random()*ids.length)]
          store.dispatch({ type: 'tickets/simulateUpdate', payload: { id, status: 'PENDING' } })
          store.dispatch({ type: 'messages/addMessage', payload: { id: Math.random().toString(36).slice(2), ticketId: id, sender: 'System', body: 'Auto-update via WS simulator', createdAt: new Date().toISOString() } })
        }
      }, 8000)
    }
    if (!state.auth.user && timer) { clearInterval(timer); timer = null }
    return result
  }
}
