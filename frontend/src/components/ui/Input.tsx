// src/components/ui/Input.tsx
import { TextField, TextFieldProps } from '@mui/material'
export type InputProps = TextFieldProps
export default function Input(props: InputProps) {
  return <TextField size="small" fullWidth {...props} />
}
