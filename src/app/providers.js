import { createContext } from 'react'
import { AuthProvider, useAuth } from '../providers/AuthProvider'
import { NotificationProvider, useNotification } from '../providers/NotificationProvider'
import { DatabaseProvider } from '../providers/DatabaseProvider'
import { RpcProvider } from '../providers/RpcProvider'

export const AppContext = createContext({}) // Ensure you have a default value or logic to use this context meaningfully.

export function Providers ({ children }) {
  return (
    <AppContext.Provider value={{}}>
      <AuthProvider>
        <DatabaseProvider>
          <RpcProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </RpcProvider>
        </DatabaseProvider>
      </AuthProvider>
    </AppContext.Provider>
  )
}

export { useAuth, useNotification }
