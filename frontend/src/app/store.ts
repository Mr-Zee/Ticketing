import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import ticketsReducer from '@/features/tickets/ticketsSlice'
import messagesReducer from '@/features/messages/messagesSlice'
import toastReducer from '@/features/toast/toastSlice'
import { wsStompMiddleware } from './wsStomp'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const authPersistConfig = { key: 'auth', storage }
const ticketsPersistConfig = { key: 'tickets', storage }


const reducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  tickets: persistReducer(ticketsPersistConfig, ticketsReducer),
  messages: messagesReducer,
  toast: toastReducer,
})

const persistedReducer = persistReducer(
  { key: 'root', storage, blacklist: [] }, // optional root gate
  reducer
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(wsStompMiddleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
