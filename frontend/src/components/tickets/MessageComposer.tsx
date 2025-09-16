
import { Box, Button, TextField, IconButton, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '@/hooks'
import { addMessage } from '@/features/messages/messagesSlice'
import { useState } from 'react'
type Form = { body: string }
export default function MessageComposer({ ticketId, user }: { ticketId: string, user: string }) {
  const { register, handleSubmit, reset } = useForm<Form>()
  const dispatch = useAppDispatch()
  const [files, setFiles] = useState<File[]>([])
  const onSubmit = (v:Form) => {
    const body = (v.body || '').trim()
    if(!body && files.length === 0) return
    const atts = files.map(f => ({ id: crypto.randomUUID(), name: f.name, size: f.size }))
    dispatch(addMessage(ticketId, user, body, atts))
    setFiles([]); reset()
  }
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display:'grid', gap:1 }}>
      <Box sx={{ display:'flex', gap:1 }}>
        <TextField fullWidth size="small" placeholder="Type a message…" {...register('body')} />
        <IconButton component="label"><AttachFileIcon /><input hidden type="file" multiple onChange={(e)=> setFiles(Array.from(e.target.files || []))} /></IconButton>
        <Button type="submit" variant="contained">Send</Button>
      </Box>
      {files.length > 0 && (<Box sx={{ display:'flex', gap:1, flexWrap:'wrap' }}>{files.map(f => <Typography key={f.name} variant="caption">📎 {f.name}</Typography>)}</Box>)}
    </Box>
  )
}
