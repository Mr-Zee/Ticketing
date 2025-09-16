
import { Button as MUIButton, ButtonProps as MUIButtonProps, CircularProgress } from '@mui/material'

export type ButtonProps = MUIButtonProps & { loading?: boolean }

export default function Button({ loading, disabled, children, ...props }: ButtonProps) {
  return (
    <MUIButton disabled={loading || disabled} {...props}>
      {loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
      {children}
    </MUIButton>
  )
}
