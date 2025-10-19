'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import './login.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Compara o input com as variáveis de ambiente
    if (
      email === process.env.NEXT_PUBLIC_LOGIN_EMAIL &&
      password === process.env.NEXT_PUBLIC_LOGIN_PASSWORD
    ) {
      login()
      router.push('/')
    } else {
      setError('Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Acesse o painel de gestão</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}