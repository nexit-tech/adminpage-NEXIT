'use client'
import { useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import './ModalAdicionarAoPortfolio.css'

export default function ModalNovoPortfolio({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    frameworks: []
  })
  const [frameworkInput, setFrameworkInput] = useState('')
  const [imagemCapa, setImagemCapa] = useState(null)
  const [pdf, setPdf] = useState(null)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.frameworks.length === 0) {
      alert('Adicione pelo menos um framework/tecnologia')
      return
    }

    if (!imagemCapa) {
      alert('A imagem de capa é obrigatória')
      return
    }

    setUploading(true)

    try {
      await onSave({
        ...formData,
        imagemCapa,
        pdf
      })
    } catch (error) {
      console.error('Erro ao adicionar ao portfólio:', error)
      alert('Erro ao adicionar projeto ao portfólio')
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-portfolio" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Novo Projeto no Portfólio</h2>
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
            <label>Imagem de Capa * <span className="label-hint">(JPG, PNG ou WEBP - máx. 5MB)</span></label>
            
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
                <span>Clique para selecionar imagem de capa</span>
                <span className="upload-hint">Recomendado: 1200x800px</span>
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
            
            {!pdf ? (
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
              {uploading ? 'Adicionando...' : 'Adicionar ao Portfólio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}