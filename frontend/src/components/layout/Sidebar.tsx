
import { Box, Button, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import InsightsIcon from '@mui/icons-material/Insights'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import TicketCreateDialog from '../tickets/TicketCreateDialog'
import { useAppSelector } from '@/hooks'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const user = useAppSelector(s => s.auth.user)
  const canCreate = user?.role === 'CUSTOMER'
  return (
    <Box sx={{ borderRight: 1, borderColor: 'divider', p: 2, display: { xs: 'none', md: 'block' } }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>TicketHub</Typography>
      <Button fullWidth variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} disabled={!canCreate} onClick={()=>setOpen(true)}>
        New Ticket
      </Button>
      {!canCreate && <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>Login as customer to create</Typography>}
      <Typography variant="overline" color="text.secondary">Tickets</Typography>
      <List dense sx={{ mb: 2 }}>
        <NavLink to="/tickets" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (<ListItemButton selected={isActive}><ListItemIcon><AllInboxIcon /></ListItemIcon><ListItemText primary="All Tickets" /></ListItemButton>)}
        </NavLink>
        <NavLink to="/analytics" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (<ListItemButton selected={isActive}><ListItemIcon><InsightsIcon /></ListItemIcon><ListItemText primary="Analytics" /></ListItemButton>)}
        </NavLink>
      </List>
      <Divider sx={{ my: 2 }} />
      <TicketCreateDialog open={open} onClose={()=>setOpen(false)} />
    </Box>
  )
}
