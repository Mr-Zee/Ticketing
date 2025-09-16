
import { AppBar, Toolbar, TextField, InputAdornment, IconButton, Avatar, Menu, MenuItem, Typography, Badge, Tooltip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setUser } from '@/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { useColorMode } from '@/theme'

export default function Topbar() {
  const user = useAppSelector(s => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const { mode, toggle } = useColorMode()
  const open = Boolean(anchor)
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)
  const handleClose = () => setAnchor(null)
  const handleLogout = () => { dispatch(setUser(null)); handleClose(); navigate('/login', { replace: true }) }
  return (
    <AppBar elevation={0} color="inherit" position="static" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2 }}>
        <TextField placeholder="Search tickets…" size="small" fullWidth sx={{ maxWidth: 640 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
        <Tooltip title={mode === 'light' ? 'Switch to dark' : 'Switch to light'}>
          <IconButton onClick={toggle}>{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>
        </Tooltip>
        <IconButton><Badge badgeContent={3} color="primary"><NotificationsNoneIcon /></Badge></IconButton>
        <IconButton onClick={handleOpen} sx={{ ml: 1 }}><Avatar sx={{ width: 32, height: 32 }}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</Avatar></IconButton>
        <Menu anchorEl={anchor} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Typography variant="subtitle2" sx={{ px: 2, pt: 1 }}>{user?.name || 'User'}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, pb: 1 }}>{user?.role}</Typography>
          <MenuItem onClick={() => navigate('/analytics')}>Analytics</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
