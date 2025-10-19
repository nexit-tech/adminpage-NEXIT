'use client'
import { Star, ExternalLink } from 'lucide-react'
import './ModalVisualizarPortfolio.css'

export default function ModalVisualizarPortfolio({ item, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-visualizar-portfolio" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{item.project_name}</h2>
            {item.is_featured && (
              <div className="badge-destaque-inline">
                <Star size={16} />
                <span>Projeto em Destaque</span>
              </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-portfolio">
          {item.cover_image_url && (
            <div className="imagem-preview">
              <img src={item.cover_image_url} alt={item.project_name} />
            </div>
          )}

          <div className="info-section">
            <h3 className="section-title">Descrição</h3>
            <p className="descricao-completa">{item.project_description}</p>
          </div>

          <div className="info-section">
            <h3 className="section-title">Tecnologias Utilizadas</h3>
            <div className="frameworks-grid">
              {item.frameworks.map((fw, idx) => (
                <div key={idx} className="framework-badge">
                  {fw}
                </div>
              ))}
            </div>
          </div>

          {item.presentation_pdf_url && (
            <div className="info-section">
              <h3 className="section-title">Apresentação</h3>
              <a 
                href={item.presentation_pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-download-pdf"
              >
                <ExternalLink size={20} />
                <span>Abrir PDF de Apresentação</span>
              </a>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-fechar" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}