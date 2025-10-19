'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Tenta carregar o estado de autenticação do localStorage
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(loggedIn)
    setLoading(false)
  }, [])

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
    router.push('/login')
  }

  const value = {
    isAuthenticated,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}