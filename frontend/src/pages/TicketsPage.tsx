
import { Grid, Typography, Box, Pagination } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchTickets, ticketsSelectors, Ticket } from '@/features/tickets/ticketsSlice'
import TicketFilters, { FilterValues } from '@/components/tickets/TicketFilters'
import TicketCard from '@/components/tickets/TicketCard'
import TicketDetail from '@/components/tickets/TicketDetail'

function sortTickets(list: Ticket[], sort: FilterValues['sort']){
  const priorityOrder: Record<string, number> = { URGENT:0, HIGH:1, MEDIUM:2, LOW:3 }
  if (sort === 'newest') return [...list].sort((a,b)=> +new Date(b.createdAt) - +new Date(a.createdAt))
  if (sort === 'oldest') return [...list].sort((a,b)=> +new Date(a.createdAt) - +new Date(b.createdAt))
  if (sort === 'priority') return [...list].sort((a,b)=> priorityOrder[a.priority]-priorityOrder[b.priority])
  if (sort === 'status') return [...list].sort((a,b)=> a.status.localeCompare(b.status))
  return list
}

export default function TicketsPage() {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector(ticketsSelectors.selectAll)
  const loading = useAppSelector(s => s.tickets.loading)
  const { id } = useParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState<FilterValues>({ q:'', status:'', priority:'', assignee:'', tag:'', sort:'newest' })
  const [page, setPage] = useState(1)
  const pageSize = 5

  useEffect(() => { dispatch(fetchTickets()) }, [dispatch])

  const filtered = useMemo(() => {
    let list = tickets
    const { q, status, priority, assignee, tag } = filters
    if (q) list = list.filter(t => t.title.toLowerCase().includes(q.toLowerCase()))
    if (status) list = list.filter(t => t.status === status)
    if (priority) list = list.filter(t => t.priority === priority)
    if (assignee) list = list.filter(t => (t.assignee || '').toLowerCase().includes(assignee.toLowerCase()))
    if (tag) list = list.filter(t => (t.tags || []).some(x => x.toLowerCase().includes(tag.toLowerCase())))
    return sortTickets(list, filters.sort)
  }, [tickets, filters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page-1)*pageSize, (page)*pageSize)

  useEffect(()=>{ setPage(1) }, [filters])

  return (
    <Grid container spacing={2}>
      {/* LEFT: Ticket list with filters, sorting, pagination */}
      <Grid item xs={12} md={6} lg={5}>
        <Typography variant="h5" sx={{ mb: 1 }}>Tickets</Typography>
        <TicketFilters onChange={setFilters} />
        {loading ? <Typography variant="body2">Loading…</Typography> : null}
        <Box sx={{ display:'grid', gap:1, mt:1 }}>
          {pageItems.map(t => (
            <div key={t.id} onClick={()=> navigate(`/tickets/${t.id}`)}>
              <TicketCard t={t} selected={t.id === id} />
            </div>
          ))}
        </Box>
        <Box sx={{ display:'flex', justifyContent:'center', mt:2 }}>
          <Pagination page={page} count={pageCount} onChange={(_,p)=>setPage(p)} />
        </Box>
      </Grid>

      {/* RIGHT: Details */}
      <Grid item xs={12} md={6} lg={7}>
        <TicketDetail />
      </Grid>
    </Grid>
  )
}
