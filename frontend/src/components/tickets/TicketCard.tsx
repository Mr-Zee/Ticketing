import { Card, CardContent, Typography, Stack, Chip } from '@mui/material'
import { Ticket } from '@/features/tickets/ticketsSlice'
import Tag from '@/components/ui/Tag'

export default function TicketCard({ t, selected }: { t: Ticket, selected?: boolean }){
  return (
    <Card variant="outlined" sx={{ borderColor: selected ? 'primary.main' : 'divider', outline: selected ? '2px solid rgba(25,118,210,.2)' : 'none' }}>
      <CardContent sx={{ display:'grid', gap:.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography fontWeight={600}>{t.title}</Typography>
          <Typography variant="caption">#{t.id}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexWrap:'wrap' }}>
          <Chip size="small" label={t.status} color={t.status === 'OPEN' ? 'warning' : t.status === 'RESOLVED' ? 'success' : 'default'} />
          <Chip size="small" label={t.priority} />
          {(t.tags || []).map(tag => <Tag key={tag} value={tag} />)}
        </Stack>
        <Typography variant="body2" color="text.secondary">{t.assignee ? `Assigned to ${t.assignee}` : 'Unassigned'}</Typography>
      </CardContent>
    </Card>
  )
}
