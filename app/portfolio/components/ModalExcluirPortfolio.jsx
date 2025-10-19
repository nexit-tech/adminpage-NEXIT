'use client'
import { AlertTriangle } from 'lucide-react'
import './ModalExcluirPortfolio.css'

export default function ModalExcluirPortfolio({ item, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-excluir-portfolio" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-excluir">
          <div className="icon-warning">
            <AlertTriangle size={48} />
          </div>
          <h2>Excluir Projeto do Portfólio?</h2>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        
        <div className="modal-body-excluir">
          <div className="projeto-info">
            <p><strong>Projeto:</strong> {item.project_name}</p>
            <p><strong>Tecnologias:</strong> {item.frameworks.join(', ')}</p>
          </div>
          <p className="aviso">
            Tem certeza que deseja excluir este projeto do portfólio?
            {item.cover_image_url && ' A imagem de capa será removida.'}
            {item.presentation_pdf_url && ' O PDF de apresentação será removido.'}
          </p>
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