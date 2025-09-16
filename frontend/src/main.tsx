import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/app/store'
import AppRoutes from '@/routes/AppRoutes'
import { ColorModeProvider } from '@/theme'
import ToastHost from '@/components/ui/ToastHost'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ColorModeProvider>
          <AppRoutes />
          <ToastHost />
        </ColorModeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
