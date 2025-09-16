
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogProps } from '@mui/material'
import { ReactNode } from 'react'

type Props = DialogProps & {
  title?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}
export default function Modal({ title, actions, children, ...props }: Props) {
  return (
    <Dialog fullWidth maxWidth="sm" {...props}>
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent sx={{ pt: 2 }}>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  )
}
