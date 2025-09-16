import { Alert, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { popToast } from '@/features/toast/toastSlice'

export default function ToastHost() {
  const dispatch = useAppDispatch()
  const queue = useAppSelector(s => s.toast.queue)
  const [open, setOpen] = useState(false)
  const toast = queue[0]

  useEffect(() => { if (toast) setOpen(true) }, [toast])

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => dispatch(popToast()), 150) // remove after animation
  }

  return (
    <Snackbar open={!!toast && open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical:'top', horizontal:'right' }}>
      {toast ? <Alert onClose={handleClose} severity={toast.severity ?? 'info'} variant="filled">{toast.message}</Alert> : null}
    </Snackbar>
  )
}
