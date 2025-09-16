import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form'
import Input, { InputProps } from './Input'
import Select, { SelectProps } from './Select'

type BaseProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  helperText?: string
}

type Props<T extends FieldValues> =
  | (BaseProps<T> & { type?: 'text' | 'textarea' | 'password' | 'email'; inputProps?: Omit<InputProps, 'name'> })
  | (BaseProps<T> & { type: 'select'; selectProps: Omit<SelectProps, 'name'> })

export default function FormField<T extends FieldValues>(props: Props<T>) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field, fieldState }) => {
        const common = { label: props.label, helperText: fieldState.error?.message ?? props.helperText, error: !!fieldState.error }
        if (props.type === 'select') {
          return <Select {...props.selectProps} {...field} {...common} />
        }
        const inputType = props.type === 'password' || props.type === 'email' ? props.type : 'text'
        return <Input type={inputType} {...(props as any).inputProps} {...field} {...common} multiline={props.type === 'textarea'} />
      }}
    />
  )
}
