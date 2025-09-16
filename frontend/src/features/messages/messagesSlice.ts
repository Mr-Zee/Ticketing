
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit'
export interface Attachment { id: string; name: string; size: number }
export interface Message { id: string; ticketId: string; sender: string; body: string; createdAt: string; attachments?: Attachment[] }
interface MessagesState { byTicket: Record<string, Message[]> }
const initialState: MessagesState = { byTicket: {} }
const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: {
      reducer: (s, a: PayloadAction<Message>) => {
        const m = a.payload; s.byTicket[m.ticketId] ??= []; s.byTicket[m.ticketId].push(m)
      },
      prepare: (ticketId: string, sender: string, body: string, attachments?: Attachment[]) => ({
        payload: { id: nanoid(), ticketId, sender, body, createdAt: new Date().toISOString(), attachments }
      })
    }
  }
})
export const { addMessage } = slice.actions
export default slice.reducer
