'use client'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()

  // Define se a navbar deve ser exibida
  const showNavbar = !loading && isAuthenticated && pathname !== '/login'

  // Se o usuário não estiver autenticado, a página de login será renderizada sem a navbar
  if (!showNavbar) {
    return <>{children}</>
  }

  // Se estiver autenticado, renderiza a Navbar e o conteúdo da página dentro do layout principal
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </>
  )
}