import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { addTicket } from '@/features/tickets/ticketsSlice'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']),
  tags: z.string().optional(),
})

export default function TicketCreateDialog({ open, onClose }:{ open: boolean, onClose: ()=>void }){
  const dispatch = useAppDispatch()
  const user = useAppSelector(s => s.auth.user)
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', priority: 'LOW', tags: '' }
  })

  const onSubmit = (v:any) => {
    const now = new Date().toISOString()
    const t = {
      id: 'T-' + Math.floor(Math.random()*900+100),
      title: v.title,
      status: 'OPEN',
      priority: v.priority,
      assignee: null,
      tags: v.tags ? v.tags.split(',').map((s:string)=>s.trim()).filter(Boolean) : [],
      createdAt: now,
      updatedAt: now,
      description: ''
    }
    dispatch(addTicket(t as any))
    reset(); onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Ticket"
      actions={
        <>
          <Button onClick={onClose} variant="text">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={user?.role !== 'CUSTOMER'}>
            Create
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <FormField control={control} name="title" label="Title" />
        <FormField
          control={control}
          name="priority"
          type="select"
          selectProps={{ label: 'Priority', options: [
            { label:'Low', value:'LOW' },
            { label:'Medium', value:'MEDIUM' },
            { label:'High', value:'HIGH' },
            { label:'Urgent', value:'URGENT' },
          ]}}
        />
        <FormField control={control} name="tags" label="Tags (comma separated)" />
      </Stack>
    </Modal>
  )
}
