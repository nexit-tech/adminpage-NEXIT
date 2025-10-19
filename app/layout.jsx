import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata = {
  title: 'Gestão Empresarial',
  description: 'Sistema de gestão de projetos, clientes e portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}