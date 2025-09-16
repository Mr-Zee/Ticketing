
import { TextField, TextFieldProps, MenuItem } from '@mui/material'

export type SelectOption = { label: string; value: string | number }
export type SelectProps = Omit<TextFieldProps, 'select' | 'children'> & { options: SelectOption[] }

export default function Select({ options, ...props }: SelectProps) {
  return (
    <TextField size="small" fullWidth select {...props}>
      {options.map(o => (
        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
      ))}
    </TextField>
  )
}
