'use client'
import { AlertTriangle } from 'lucide-react'
import './ModalExcluirLead.css'

export default function ModalExcluirLead({ lead, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-excluir" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-excluir">
          <div className="icon-warning">
            <AlertTriangle size={48} />
          </div>
          <h2>Excluir Lead?</h2>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        
        <div className="modal-body-excluir">
          <div className="lead-info">
            <p><strong>Empresa:</strong> {lead.company}</p>
            <p><strong>Contato:</strong> {lead.name}</p>
            <p><strong>Email:</strong> {lead.email}</p>
          </div>
          <p className="aviso">Tem certeza que deseja excluir este lead?</p>
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