import { createContext, useState, useContext, useEffect } from 'react'
import { authFacade, userFacade } from 'peer-pass-backend'

const AuthContext = createContext()

export function useAuth () {
  return useContext(AuthContext)
}

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    const checkUserLoggedIn = async () => {
      setLoading(true)
      await getUser()
      setLoading(false)
    }
    checkUserLoggedIn()
  }, [])

  const getUser = async () => {
    const user = await userFacade.get()
    setUser(user && user.isAuthenticated ? user : null)
  }

  const login = async (payload) => {
    const { username, password } = payload
    return await authFacade.login({ username, password })
  }

  const restore = async (payload) => {
    return await authFacade.restore(payload)
  }

  const logout = () => {
    // @TODO: implement + redirect to auth page
    // await authFacade.logout({ username, password })
    setUser(null)
  }

  const isAuthenticated = () => user && user.isAuthenticated

  const authContextValue = { user, setUser, getUser, login, restore, logout, loading, isAuthenticated }

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}
