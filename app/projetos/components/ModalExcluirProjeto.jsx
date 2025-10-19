'use client'
import { AlertTriangle } from 'lucide-react'
import './ModalExcluirProjeto.css'

export default function ModalExcluirProjeto({ projeto, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-excluir" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-excluir">
          <div className="icon-warning">
            <AlertTriangle size={48} />
          </div>
          <h2>Excluir Projeto?</h2>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        
        <div className="modal-body-excluir">
          <div className="projeto-info">
            <p><strong>Projeto:</strong> {projeto.nome}</p>
            <p><strong>Cliente:</strong> {projeto.cliente}</p>
          </div>
          <p className="aviso">Tem certeza que deseja excluir este projeto?</p>
        </div>

        <div className="modal-footer-excluir">
          <button className="btn-cancelar-excluir" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirmar-excluir" onClick={onConfirm}>
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  )
}