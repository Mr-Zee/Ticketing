import Modal from './Modal'
import Button from './Button'

type Props = {
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}
export default function ConfirmDialog({
  open, title = 'Confirm', message = 'Are you sure?',
  confirmText = 'Confirm', cancelText = 'Cancel', loading, onClose, onConfirm
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} actions={
      <>
        <Button onClick={onClose} variant="text">{cancelText}</Button>
        <Button onClick={onConfirm} variant="contained" color="primary" loading={loading}>{confirmText}</Button>
      </>
    }>
      {message}
    </Modal>
  )
}
