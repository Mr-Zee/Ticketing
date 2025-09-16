
import { Chip, ChipProps } from '@mui/material'
export type TagProps = ChipProps & { value: string }
export default function Tag({ value, ...props }: TagProps) {
  return <Chip size="small" label={value} variant="outlined" {...props} />
}
