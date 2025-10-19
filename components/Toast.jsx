'use client'
import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import './Toast.css'

export default function Toast({ tipo = 'success', mensagem, onClose, duracao = 3000 }) {
  useEffect(() => {
    if (duracao > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duracao)

      return () => clearTimeout(timer)
    }
  }, [duracao, onClose])

  const getIcon = () => {
    switch (tipo) {
      case 'success':
        return <CheckCircle size={24} />
      case 'error':
        return <XCircle size={24} />
      case 'warning':
        return <AlertCircle size={24} />
      default:
        return <CheckCircle size={24} />
    }
  }

  const getTitulo = () => {
    switch (tipo) {
      case 'success':
        return 'Sucesso!'
      case 'error':
        return 'Erro!'
      case 'warning':
        return 'Atenção!'
      default:
        return 'Notificação'
    }
  }

  return (
    <div className={`toast toast-${tipo}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <h4 className="toast-titulo">{getTitulo()}</h4>
        <p className="toast-mensagem">{mensagem}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  )
}