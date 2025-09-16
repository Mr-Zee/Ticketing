
import { Box, Chip, Divider, Typography, Stack, MenuItem, TextField, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { ticketsSelectors, updateTicket, Ticket } from '@/features/tickets/ticketsSlice'
import MessageComposer from './MessageComposer'
import { useParams } from 'react-router-dom'
export default function TicketDetail(){
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const ticket = useAppSelector(s => ticketsSelectors.selectById(s, id!))
  const messages = useAppSelector(s => s.messages.byTicket[id!]) || []
  const user = useAppSelector(s => s.auth.user)

  if(!id || !ticket) return <Typography>Select a ticket.</Typography>
  const canEdit = user?.role === 'AGENT' || user?.role === 'ADMIN'
  const handleChange = (field: keyof Ticket) => (e: any) => {
    const value = e.target.value
    dispatch(updateTicket({ id, changes: { [field]: value, updatedAt: new Date().toISOString() } }))
  }
  return (
    <Box sx={{ display:'grid', gap:2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{ticket.title} <Typography component="span" variant="body2">#{ticket.id}</Typography></Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" color="success" onClick={()=>dispatch(updateTicket({ id, changes:{ status:'RESOLVED' }}))}>Close Ticket</Button>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Chip size="small" label={ticket.status} color={ticket.status === 'RESOLVED' ? 'success' : ticket.status === 'OPEN' ? 'warning' : 'default'} />
        <Chip size="small" label={ticket.priority} />
        <Chip size="small" label={`Assignee: ${ticket.assignee ?? 'Unassigned'}`} />
      </Stack>
      <Divider />
      <Typography variant="subtitle2">Metadata</Typography>
      <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
        <TextField size="small" label="Status" select value={ticket.status} onChange={handleChange('status')} disabled={!canEdit} sx={{ minWidth: 200 }}>
          {['OPEN','PENDING','RESOLVED','CLOSED'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Priority" select value={ticket.priority} onChange={handleChange('priority')} disabled={!canEdit} sx={{ minWidth: 200 }}>
          {['LOW','MEDIUM','HIGH','URGENT'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Assignee" value={ticket.assignee || ''} onChange={handleChange('assignee')} disabled={!canEdit} sx={{ minWidth: 240 }} placeholder="Type a name" />
      </Stack>
      <Typography variant="body2" color="text.secondary">Created: {new Date(ticket.createdAt).toLocaleString()} • Updated: {new Date(ticket.updatedAt).toLocaleString()}</Typography>
      <Divider />
      <Typography variant="h6">Conversation</Typography>
      <Box sx={{ height: 300, overflow:'auto', border:'1px dashed', borderColor:'divider', p:2, borderRadius:1 }}>
        {messages.length
          ? messages.map(m => (
              <Box key={m.id} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">{new Date(m.createdAt).toLocaleString()} • {m.sender === user.name ? 'You' : m.sender}</Typography>
                <Typography>{m.body}</Typography>
                {m.attachments?.length ? m.attachments.map(a => <Typography key={a.id} variant="caption">📎 {a.name}</Typography>) : null}
              </Box>
            ))
          : <Typography variant="body2" color="text.secondary">No messages yet</Typography>
        }
      </Box>
      <MessageComposer ticketId={id} user={user.name} />
    </Box>
  )
}
