import { Box, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

export type FilterValues = {
  q: string
  status: ''|'OPEN'|'PENDING'|'RESOLVED'|'CLOSED'
  priority: ''|'LOW'|'MEDIUM'|'HIGH'|'URGENT'
  assignee: string
  tag: string
  sort: 'newest'|'oldest'|'priority'|'status'
}

export default function TicketFilters({ onChange }: { onChange: (v: FilterValues)=>void }){
  const { register, handleSubmit } = useForm<FilterValues>({ defaultValues: { q: '', status: '', priority: '', assignee: '', tag: '', sort: 'newest' } })
  return (
    <Box component="form" onSubmit={handleSubmit(onChange)} sx={{ display:'grid', gap:2, gridTemplateColumns:{ xs:'1fr', md:'repeat(6,1fr)'}}}>
      <Input label="Search" {...register('q')} />
      <Select label="Status" defaultValue="" options={[
        {label:'All', value:''},{label:'OPEN', value:'OPEN'},{label:'PENDING', value:'PENDING'},{label:'RESOLVED', value:'RESOLVED'},{label:'CLOSED', value:'CLOSED'}
      ]} {...register('status')} />
      <Select label="Priority" defaultValue="" options={[
        {label:'All', value:''},{label:'LOW', value:'LOW'},{label:'MEDIUM', value:'MEDIUM'},{label:'HIGH', value:'HIGH'},{label:'URGENT', value:'URGENT'}
      ]} {...register('priority')} />
      <Input label="Assignee" placeholder="e.g. Sarah" {...register('assignee')} />
      <Input label="Tag" placeholder="e.g. ui" {...register('tag')} />
      <Select label="Sort" defaultValue="newest" options={[
        {label:'Newest', value:'newest'},{label:'Oldest', value:'oldest'},{label:'Priority', value:'priority'},{label:'Status', value:'status'}
      ]} {...register('sort')} />
      <Stack direction="row" spacing={1}><Button type="submit" variant="contained">Apply</Button></Stack>
    </Box>
  )
}
