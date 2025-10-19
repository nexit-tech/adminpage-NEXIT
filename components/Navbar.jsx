'use client'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Briefcase, Users, FolderKanban, DollarSign, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'
import './Navbar.css'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navItems = [
    { 
      href: '/', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={18} /> 
    },
    { 
      href: '/projetos', 
      label: 'Projetos', 
      icon: <Briefcase size={18} /> 
    },
    { 
      href: '/clientes', 
      label: 'Clientes', 
      icon: <Users size={18} /> 
    },
    { 
      href: '/portfolio', 
      label: 'Portfolio', 
      icon: <FolderKanban size={18} /> 
    },
    { 
      href: '/financeiro', 
      label: 'Financeiro', 
      icon: <DollarSign size={18} /> 
    }
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Image 
            src="/favicon.ico" 
            alt="Nexit Logo" 
            width={32} 
            height={32}
            className="logo-icon"
          />
          <span className="logo-text">Nexit Tech</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* User Actions */}
        <div className="navbar-actions">
          <button className="nav-link" title="Usuário">
            <User size={18} />
            <span>Usuário</span>
          </button>
          <button className="nav-link logout-btn" onClick={handleLogout} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}