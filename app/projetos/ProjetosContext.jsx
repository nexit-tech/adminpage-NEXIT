'use client'
import { createContext, useContext, useState } from 'react'

const ProjetosContext = createContext()

export function ProjetosProvider({ children }) {
  const [atualizarTrigger, setAtualizarTrigger] = useState(Date.now())

  const dispararAtualizacao = () => {
    console.log('🔄 Context: Disparando atualização global')
    setAtualizarTrigger(Date.now()) // Usa timestamp para garantir mudança
  }

  return (
    <ProjetosContext.Provider value={{ atualizarTrigger, dispararAtualizacao }}>
      {children}
    </ProjetosContext.Provider>
  )
}

export function useProjetosContext() {
  const context = useContext(ProjetosContext)
  if (!context) {
    throw new Error('useProjetosContext deve ser usado dentro de ProjetosProvider')
  }
  return context
}