'use client'
import { useState } from 'react'
import './ModalNovaTarefa.css'

export default function ModalNovaTarefa({ onClose, onSave, tipo = 'tarefa' }) {
  const [titulo, setTitulo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (titulo.trim()) {
      onSave({ titulo: titulo.trim() })
      setTitulo('')
    }
  }

  return (
    <div className="modal-overlay modal-overlay-nested" onClick={onClose}>
      <div className="modal-content modal-nova-tarefa" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{tipo === 'subtarefa' ? 'Nova Subtarefa' : 'Nova Tarefa'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              {tipo === 'subtarefa' ? 'Título da Subtarefa' : 'Título da Tarefa'} *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={tipo === 'subtarefa' ? 'Ex: Criar componente de login' : 'Ex: Desenvolvimento do Backend'}
              autoFocus
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}