import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Toast = { id: string; message: string; severity?: 'success'|'info'|'warning'|'error' }
type State = { queue: Toast[] }
const initial: State = { queue: [] }

const slice = createSlice({
  name: 'toast',
  initialState: initial,
  reducers: {
    pushToast: (s, a: PayloadAction<Omit<Toast,'id'>>) => {
      s.queue.push({ id: crypto.randomUUID(), ...a.payload })
    },
    popToast: (s) => { s.queue.shift() }
  }
})

export const { pushToast, popToast } = slice.actions
export default slice.reducer
