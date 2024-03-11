import { createContext, useState, useContext, useCallback } from 'react'

const NotificationContext = createContext()

// Hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext)
}

let nextId = 0 // Unique ID for each notification
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = useCallback((notification) => {
    const id = nextId++
    setNotifications((prev) => [...prev, { ...notification, show: true, id }])
    const time = notification.isFail ? 7500 : 3000
    setTimeout(() => {
      hideNotification(id)
    }, time)
  }, [])

  const hideNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
