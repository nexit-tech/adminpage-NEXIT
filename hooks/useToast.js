import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const mostrarToast = useCallback((tipo, mensagem, duracao = 3000) => {
    const id = Date.now()
    const novoToast = { id, tipo, mensagem, duracao }
    
    setToasts(prev => [...prev, novoToast])

    // Remove automaticamente após a duração
    if (duracao > 0) {
      setTimeout(() => {
        removerToast(id)
      }, duracao)
    }

    return id
  }, [])

  const removerToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((mensagem, duracao) => {
    return mostrarToast('success', mensagem, duracao)
  }, [mostrarToast])

  const error = useCallback((mensagem, duracao) => {
    return mostrarToast('error', mensagem, duracao)
  }, [mostrarToast])

  const warning = useCallback((mensagem, duracao) => {
    return mostrarToast('warning', mensagem, duracao)
  }, [mostrarToast])

  return {
    toasts,
    success,
    error,
    warning,
    removerToast
  }
}