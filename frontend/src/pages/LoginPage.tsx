import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Box, Typography, Paper } from '@mui/material'
import { useAppDispatch } from '@/hooks'
import { setUser } from '@/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'

const schema = z.object({ email: z.string().email(), password: z.string().min(4) })

export default function LoginPage(){
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { control, handleSubmit, setValue, formState:{ isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const resolveRole = (email: string) => email === 'admin@example.com' ? 'ADMIN' : email === 'agent@example.com' ? 'AGENT' : 'CUSTOMER'

  const onSubmit = async (v:any) => {
    if (v.password !== 'password') { alert('Invalid password (use: password)'); return }
    const role = resolveRole(v.email)
    dispatch(setUser({ id:'1', name:v.email, role } as any))
    navigate('/tickets', { replace: true })
  }

  const quick = (email: string) => { setValue('email', email); setValue('password', 'password') }

  return (
    <Box sx={{ maxWidth: 380, mx: 'auto', mt: 8, display: 'grid', gap: 2 }}>
      <Typography variant="h5" textAlign="center">Sign in</Typography>
      <FormField control={control} name="email" label="Email" />
      <FormField control={control} name="password" label="Password" />
      <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} variant="contained">Login</Button>

      <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" textAlign="center">Demo Credentials:</Typography>
        <Typography variant="body2">Admin: <b>admin@example.com</b> / <b>password</b></Typography>
        <Typography variant="body2">Agent: <b>agent@example.com</b> / <b>password</b></Typography>
        <Typography variant="body2">Customer: <b>customer@example.com</b> / <b>password</b></Typography>
        <Box sx={{ display:'flex', gap:1, mt:1, flexWrap:'wrap' }}>
          <Button size="small" onClick={()=>quick('admin@example.com')}>Use Admin</Button>
          <Button size="small" onClick={()=>quick('agent@example.com')}>Use Agent</Button>
          <Button size="small" onClick={()=>quick('customer@example.com')}>Use Customer</Button>
        </Box>
      </Paper>
    </Box>
  )
}
