
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export type Role = 'CUSTOMER' | 'AGENT' | 'ADMIN'
export interface User { id: string; name: string; role: Role }
interface AuthState { user: User | null }
const initialState: AuthState = { user: null }
const slice = createSlice({
  name: 'auth', initialState,
  reducers: { setUser: (s, a: PayloadAction<User | null>) => { s.user = a.payload } }
})
export const { setUser } = slice.actions
export default slice.reducer
