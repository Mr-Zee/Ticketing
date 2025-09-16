
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks'
export default function ProtectedRoute({ children }: { children: JSX.Element }){
  const user = useAppSelector(s => s.auth.user)
  return user ? children : <Navigate to="/login" replace />
}
