'use client'
import { useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Star } from 'lucide-react'
import './ModalAdicionarAoPortfolio.css'

export default function ModalEditarPortfolio({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    projectName: item.project_name,
    description: item.project_description,
    frameworks: item.frameworks,
    isFeatured: item.is_featured,
    displayOrder: item.display_order
  })
  const [frameworkInput, setFrameworkInput] = useState('')
  const [imagemCapa, setImagemCapa] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [removeuPdf, setRemoveuPdf] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleImagemChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande. Tamanho máximo: 5MB')
        return
      }
      
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
      if (!tiposPermitidos.includes(file.type)) {
        alert('Tipo de arquivo não permitido. Use: JPG, PNG ou WEBP')
        return
      }
      
      setImagemCapa(file)
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('PDF muito grande. Tamanho máximo: 10MB')
        return
      }
      
      if (file.type !== 'application/pdf') {
        alert('Tipo de arquivo não permitido. Use apenas PDF')
        return
      }
      
      setPdf(file)
      setRemoveuPdf(false)
    }
  }

  const adicionarFramework = () => {
    if (frameworkInput.trim() && !formData.frameworks.includes(frameworkInput.trim())) {
      setFormData({
        ...formData,
        frameworks: [...formData.frameworks, frameworkInput.trim()]
      })
      setFrameworkInput('')
    }
  }

  const removerFramework = (framework) => {
    setFormData({
      ...formData,
      frameworks: formData.frameworks.filter(f => f !== framework)
    })
  }

  const removerPdfExistente = () => {
    setRemoveuPdf(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.frameworks.length === 0) {
      alert('Adicione pelo menos um framework/tecnologia')
      return
    }

    setUploading(true)

    try {
      await onSave({
        ...formData,
        imagemCapa,
        pdf,
        removeuPdf
      })
    } catch (error) {
      console.error('Erro ao editar portfólio:', error)
      alert('Erro ao editar projeto do portfólio')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFrameworkKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      adicionarFramework()
    }
  }

  const temPdfAtual = item.presentation_pdf_url && !removeuPdf

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-portfolio" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Projeto</h2>
          <button className="modal-close" onClick={onClose} disabled={uploading}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Projeto *</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Ex: Sistema de Gestão Empresarial"
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label>Descrição do Projeto *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o projeto, seus objetivos e resultados..."
              rows="4"
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label>Frameworks e Tecnologias *</label>
            <div className="framework-input-container">
              <input
                type="text"
                value={frameworkInput}
                onChange={(e) => setFrameworkInput(e.target.value)}
                onKeyPress={handleFrameworkKeyPress}
                placeholder="Ex: React, Node.js, PostgreSQL..."
                disabled={uploading}
              />
              <button 
                type="button" 
                className="btn-add-framework"
                onClick={adicionarFramework}
                disabled={uploading}
              >
                Adicionar
              </button>
            </div>
            
            {formData.frameworks.length > 0 && (
              <div className="frameworks-lista">
                {formData.frameworks.map((fw, idx) => (
                  <div key={idx} className="framework-tag">
                    <span>{fw}</span>
                    <button 
                      type="button" 
                      onClick={() => removerFramework(fw)}
                      disabled={uploading}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Imagem de Capa 
              <span className="label-hint">
                {item.cover_image_url ? '(Deixe em branco para manter a atual)' : '(JPG, PNG ou WEBP - máx. 5MB)'}
              </span>
            </label>
            
            {!imagemCapa ? (
              <label className="upload-area">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImagemChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <ImageIcon size={32} />
                <span>
                  {item.cover_image_url ? 'Clique para alterar imagem de capa' : 'Clique para selecionar imagem de capa'}
                </span>
              </label>
            ) : (
              <div className="arquivo-selecionado">
                <ImageIcon size={20} />
                <span>{imagemCapa.name}</span>
                <button 
                  type="button" 
                  onClick={() => setImagemCapa(null)} 
                  className="btn-remover"
                  disabled={uploading}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>PDF de Apresentação <span className="label-hint">(Opcional - máx. 10MB)</span></label>
            
            {temPdfAtual && !pdf ? (
              <div className="arquivo-atual">
                <FileText size={20} />
                <span>PDF atual anexado</span>
                <button 
                  type="button" 
                  onClick={removerPdfExistente} 
                  className="btn-remover"
                  disabled={uploading}
                >
                  <X size={16} />
                </button>
              </div>
            ) : !pdf ? (
              <label className="upload-area">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <FileText size={32} />
                <span>Clique para anexar PDF de apresentação</span>
              </label>
            ) : (
              <div className="arquivo-selecionado">
                <FileText size={20} />
                <span>{pdf.name}</span>
                <button 
                  type="button" 
                  onClick={() => setPdf(null)} 
                  className="btn-remover"
                  disabled={uploading}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                disabled={uploading}
              />
              <Star size={18} />
              <span>Marcar como Destaque</span>
            </label>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-salvar"
              disabled={uploading}
            >
              {uploading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}