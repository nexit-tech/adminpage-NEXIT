'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login')
      }
    }, [isAuthenticated, loading, router])

    if (loading || !isAuthenticated) {
      // Pode mostrar um spinner de carregamento aqui
      return <div>Carregando...</div>
    }

    return <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withAuth