'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, FolderKanban, Users, Briefcase, DollarSign, User, Menu, X, LogOut } from 'lucide-react'
import './Navbar.css'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)
  const { logout } = useAuth()

  const handleLogout = () => {
    setMenuAberto(false)
    logout()
  }

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projetos', label: 'Projetos', icon: FolderKanban },
    { href: '/clientes', label: 'Clientes', icon: Users },
    { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <Building2 size={28} strokeWidth={2.5} />
          <span>Minha Empresa</span>
        </Link>

        <div className={`navbar-links ${menuAberto ? 'mobile-open' : ''}`}>
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuAberto(false)}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            )
          })}
          {/* Botão de Sair para o menu mobile */}
          <button className="nav-link-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>

        {/* Itens da direita para Desktop */}
        <div className="navbar-desktop-right">
          <div className="navbar-user">
            <User size={20} />
            <span>Usuário</span>
          </div>
          <button className="btn-logout" onClick={logout} title="Sair">
            <LogOut size={20} />
          </button>
        </div>

        {/* Botão de Menu Mobile */}
        <button className="navbar-toggle" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}