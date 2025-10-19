'use client'
import { useState } from 'react'
import { Star, Download, Copy, Check, FileText } from 'lucide-react'
import './ModalVisualizarPortfolio.css'

export default function ModalVisualizarPortfolio({ item, onClose }) {
  const [copiado, setCopiado] = useState(false)

  const baixarImagem = () => {
    const link = document.createElement('a')
    link.href = item.cover_image_url
    link.download = `${item.project_name.replace(/\s+/g, '_')}_capa.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const baixarPDF = () => {
    if (!item.presentation_pdf_url) return
    
    const link = document.createElement('a')
    link.href = item.presentation_pdf_url
    link.download = `${item.project_name.replace(/\s+/g, '_')}_apresentacao.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copiarDescricao = async () => {
    try {
      await navigator.clipboard.writeText(item.project_description)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
      alert('Erro ao copiar descrição')
    }
  }

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
            <div className="imagem-preview-container">
              <div className="imagem-preview">
                <img src={item.cover_image_url} alt={item.project_name} />
              </div>
              <button className="btn-download-imagem" onClick={baixarImagem}>
                <Download size={18} />
                <span>Baixar Imagem de Capa</span>
              </button>
            </div>
          )}

          <div className="info-section">
            <div className="section-header">
              <h3 className="section-title">Descrição</h3>
              <button 
                className={`btn-copiar ${copiado ? 'copiado' : ''}`}
                onClick={copiarDescricao}
                title="Copiar descrição"
              >
                {copiado ? (
                  <>
                    <Check size={16} />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
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
              <div className="pdf-actions">
                <button 
                  className="btn-download-pdf"
                  onClick={baixarPDF}
                >
                  <Download size={20} />
                  <span>Baixar PDF</span>
                </button>
                <a 
                  href={item.presentation_pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-abrir-pdf"
                >
                  <FileText size={20} />
                  <span>Abrir PDF</span>
                </a>
              </div>
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