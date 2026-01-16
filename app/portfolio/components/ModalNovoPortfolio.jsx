import { useState } from 'react'
import { X, Upload, Image as ImageIcon, Smartphone, Monitor, Loader2 } from 'lucide-react'
import './ModalNovoPortfolio.css'

// Limite de 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024

function ModalNovoPortfolio({ onClose, onSave }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    frameworks: [],
    imagemCapa: null,
    pdf: null,
    imagensMobile: [],
    imagensDesktop: []
  })

  const [frameworkInput, setFrameworkInput] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validarArquivos = (arquivos) => {
    const lista = Array.isArray(arquivos) ? arquivos : [arquivos]
    for (const file of lista) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`O arquivo "${file.name}" é muito grande! O limite é 50MB.`)
        return false
      }
    }
    return true
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (!files || files.length === 0) return

    if (name === 'imagensMobile' || name === 'imagensDesktop') {
      const arquivosArray = Array.from(files)
      if (validarArquivos(arquivosArray)) {
        setFormData(prev => ({ ...prev, [name]: arquivosArray }))
      } else {
        e.target.value = ''
      }
    } else {
      const arquivo = files[0]
      if (validarArquivos(arquivo)) {
        setFormData(prev => ({ ...prev, [name]: arquivo }))
      } else {
        e.target.value = ''
      }
    }
  }

  const addFramework = (e) => {
    // Previne comportamento padrão se chamado via evento de click ou keydown
    if (e) e.preventDefault()
    
    if (frameworkInput.trim()) {
      setFormData(prev => ({
        ...prev,
        frameworks: [...prev.frameworks, frameworkInput.trim()]
      }))
      setFrameworkInput('')
    }
  }

  const handleFrameworkKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // <--- AQUI ESTÁ O PULO DO GATO
      addFramework()
    }
  }

  const removeFramework = (index) => {
    setFormData(prev => ({
      ...prev,
      frameworks: prev.frameworks.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.imagemCapa) {
      alert('A imagem de capa é obrigatória!')
      return
    }

    setLoading(true)

    try {
      await onSave(formData)
    } catch (error) {
      console.error(error)
      setLoading(false)
      alert('Erro ao salvar. Tente novamente.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-portfolio">
        <div className="modal-header">
          <h2>Novo Item no Portfólio</h2>
          <button className="btn-close" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Projeto</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              disabled={loading}
              onKeyDown={(e) => { if(e.key === 'Enter') e.preventDefault() }} // Previne envio acidental no nome
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              disabled={loading}
            />
          </div>

          <div className="uploads-grid">
            {/* Capa */}
            <div className="form-group upload-box">
              <label><ImageIcon size={16} /> Imagem de Capa (Max 50MB)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="imagemCapa"
                  onChange={handleFileChange}
                  accept="image/*"
                  id="novo-capa"
                  required
                  disabled={loading}
                />
                <label htmlFor="novo-capa" className={`btn-upload ${loading ? 'disabled' : ''}`}>
                  {formData.imagemCapa ? formData.imagemCapa.name : 'Selecionar Capa'}
                </label>
              </div>
            </div>

            {/* PDF */}
            <div className="form-group upload-box">
              <label><Upload size={16} /> Apresentação PDF (Max 50MB)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="pdf"
                  onChange={handleFileChange}
                  accept=".pdf"
                  id="novo-pdf"
                  disabled={loading}
                />
                <label htmlFor="novo-pdf" className={`btn-upload secondary ${loading ? 'disabled' : ''}`}>
                  {formData.pdf ? formData.pdf.name : 'Selecionar PDF'}
                </label>
              </div>
            </div>

            {/* Mobile */}
            <div className="form-group upload-box">
              <label><Smartphone size={16} /> Imagens Mobile (Max 50MB)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="imagensMobile"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  id="novo-mobile"
                  disabled={loading}
                />
                <label htmlFor="novo-mobile" className={`btn-upload secondary ${loading ? 'disabled' : ''}`}>
                  {formData.imagensMobile.length > 0 ? `${formData.imagensMobile.length} arquivos` : 'Selecionar Mobile'}
                </label>
              </div>
            </div>

            {/* Desktop */}
            <div className="form-group upload-box">
              <label><Monitor size={16} /> Imagens Desktop (Max 50MB)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="imagensDesktop"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  id="novo-desktop"
                  disabled={loading}
                />
                <label htmlFor="novo-desktop" className={`btn-upload secondary ${loading ? 'disabled' : ''}`}>
                  {formData.imagensDesktop.length > 0 ? `${formData.imagensDesktop.length} arquivos` : 'Selecionar Desktop'}
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Frameworks (Tecle Enter para adicionar)</label>
            <div className="framework-input">
              <input
                type="text"
                value={frameworkInput}
                onChange={(e) => setFrameworkInput(e.target.value)}
                onKeyDown={handleFrameworkKeyDown} // <--- AQUI A CORREÇÃO
                placeholder="Ex: React, Node.js..."
                disabled={loading}
              />
              <button onClick={addFramework} type="button" disabled={loading}>Adicionar</button>
            </div>
            <div className="frameworks-list">
              {formData.frameworks.map((fw, index) => (
                <span key={index} className="tag">
                  {fw}
                  <button type="button" onClick={() => removeFramework(index)} disabled={loading}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-confirm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spinner" size={18} /> Salvando...
                </>
              ) : (
                'Salvar Projeto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNovoPortfolio