import { Middleware } from '@reduxjs/toolkit'
import { Client, IMessage } from '@stomp/stompjs'
import { pushToast } from '@/features/toast/toastSlice'
import { addTicket, updateTicket } from '@/features/tickets/ticketsSlice'
import { addMessage } from '@/features/messages/messagesSlice'

export const wsStompMiddleware: Middleware = (store) => {
  let client: Client | null = null
  let connected = false
  let tried = false

  const connect = () => {
    if (connected || tried) return
    tried = true

    const url = import.meta.env.VITE_WS_URL 
    if (!url) return

    client = new Client({
      brokerURL: url,
      reconnectDelay: 3000, 
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {}, 
      onConnect: () => {
        connected = true
        store.dispatch(pushToast({ message: 'Connected to live updates', severity: 'success' }))

        client!.subscribe('/topic/tickets.new', (msg) => onNewTicket(msg))
        client!.subscribe('/topic/tickets.updated', (msg) => onTicketUpdated(msg))
      

      },
      onStompError: () => {
        store.dispatch(pushToast({ message: 'WebSocket error', severity: 'error' }))
      },
      onWebSocketClose: () => {
        connected = false
        store.dispatch(pushToast({ message: 'Disconnected. Reconnecting…', severity: 'warning' }))
      }
    })
    client.activate()
  }

  const onNewTicket = (msg: IMessage) => {
    try {
      const data = JSON.parse(msg.body)
      if (data?.ticket) {
        store.dispatch(addTicket(data.ticket))
        store.dispatch(pushToast({ message: `New ticket #${data.ticket.id}`, severity: 'info' }))
      }
    } catch {}
  }

  const onTicketUpdated = (msg: IMessage) => {
    try {
      const data = JSON.parse(msg.body) 
      if (data?.id && data?.changes) {
        store.dispatch(updateTicket({ id: data.id, changes: data.changes }))
        const what =
          data.changes.status ? `status → ${data.changes.status}` :
          data.changes.assignee ? `assignee → ${data.changes.assignee}` : 'updated'
        store.dispatch(pushToast({ message: `Ticket #${data.id} ${what}`, severity: 'info' }))
      }
    } catch {}
  }

  
  const onNewMessage = (msg: IMessage) => {
    try {
      const data = JSON.parse(msg.body) 
      if (data?.ticketId) {
        store.dispatch(addMessage(data.ticketId, data.sender ?? 'User', data.body ?? '', data.attachments))
        store.dispatch(pushToast({ message: `New message on #${data.ticketId}`, severity: 'info' }))
      }
    } catch {}
  }

  return (next) => (action) => {
    const prevAuth = (store.getState() as any).auth.user
    const result = next(action)
    const auth = (store.getState() as any).auth.user

    if (!prevAuth && auth) connect()

    if (prevAuth && !auth && client) {
      client.deactivate()
      client = null
      connected = false
      tried = false
    }

    return result
  }
}
