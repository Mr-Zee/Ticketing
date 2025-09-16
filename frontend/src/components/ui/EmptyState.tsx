
import { Box, Typography } from '@mui/material'
type Props = { title?: string; description?: string; icon?: React.ReactNode }
export default function EmptyState({ title = 'Nothing here yet', description, icon }: Props) {
  return (
    <Box sx={{ textAlign:'center', p:4, color:'text.secondary' }}>
      <Box sx={{ fontSize:48, mb:1 }}>{icon ?? '🗂️'}</Box>
      <Typography variant="subtitle1">{title}</Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  )
}
