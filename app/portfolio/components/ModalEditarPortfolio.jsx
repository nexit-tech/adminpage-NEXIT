import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Smartphone, Monitor, Loader2, Save } from 'lucide-react'
import './ModalEditarPortfolio.css'

// Limite de 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024

function ModalEditarPortfolio({ item, onClose, onSave }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    frameworks: [],
    imagemCapa: null,
    pdf: null,
    imagensMobile: [],
    imagensDesktop: [],
    isFeatured: false,
    displayOrder: 0
  })

  const [frameworkInput, setFrameworkInput] = useState('')

  useEffect(() => {
    if (item) {
      setFormData({
        projectName: item.project_name || '',
        description: item.project_description || '',
        frameworks: item.frameworks || [],
        imagemCapa: null,
        pdf: null,
        imagensMobile: [],
        imagensDesktop: [],
        isFeatured: item.is_featured || false,
        displayOrder: item.display_order || 0
      })
    }
  }, [item])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validarArquivos = (arquivos) => {
    const lista = Array.isArray(arquivos) ? arquivos : [arquivos]
    for (const file of lista) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`O arquivo "${file.name}" excede o limite de 50MB.`)
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
      e.preventDefault() // <--- TRAVA O ENTER AQUI TAMBÉM
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
    setLoading(true)

    try {
      await onSave(formData)
    } catch (error) {
      console.error(error)
      setLoading(false)
      alert('Erro ao atualizar. Tente novamente.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-portfolio-edit">
        <div className="modal-header">
          <h2>Editar Projeto</h2>
          <button className="btn-close" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-grow">
              <label>Nome do Projeto</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                disabled={loading}
                onKeyDown={(e) => { if(e.key === 'Enter') e.preventDefault() }}
              />
            </div>
            
            <div className="form-group small-input">
              <label>Ordem</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
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

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                disabled={loading}
              />
              Destacar este projeto no topo do portfólio
            </label>
          </div>

          <div className="uploads-grid">
            {/* Capa */}
            <div className="form-group upload-box">
              <div className="label-with-status">
                <label><ImageIcon size={16} /> Capa (Max 50MB)</label>
                {item.cover_image_url && !formData.imagemCapa && <span className="status-badge current">Atual mantida</span>}
                {formData.imagemCapa && <span className="status-badge new">Nova selecionada</span>}
              </div>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="imagemCapa"
                  onChange={handleFileChange}
                  accept="image/*"
                  id="edit-capa"
                  disabled={loading}
                />
                <label htmlFor="edit-capa" className={`btn-upload ${loading ? 'disabled' : ''}`}>
                  {formData.imagemCapa ? formData.imagemCapa.name : 'Alterar Capa'}
                </label>
              </div>
            </div>

            {/* PDF */}
            <div className="form-group upload-box">
              <div className="label-with-status">
                <label><Upload size={16} /> PDF (Max 50MB)</label>
                {item.presentation_pdf_url && !formData.pdf && <span className="status-badge current">Atual mantido</span>}
                {formData.pdf && <span className="status-badge new">Novo selecionado</span>}
              </div>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="pdf"
                  onChange={handleFileChange}
                  accept=".pdf"
                  id="edit-pdf"
                  disabled={loading}
                />
                <label htmlFor="edit-pdf" className={`btn-upload secondary ${loading ? 'disabled' : ''}`}>
                  {formData.pdf ? formData.pdf.name : 'Alterar PDF'}
                </label>
              </div>
            </div>

            {/* Mobile */}
            <div className="form-group upload-box">
              <div className="label-with-status">
                <label><Smartphone size={16} /> Mobile (Múltiplas)</label>
                {item.mobile_images_urls?.length > 0 && formData.imagensMobile.length === 0 && (
                  <span className="status-badge current">{item.mobile_images_urls.length} imgs atuais</span>
                )}
                {formData.imagensMobile.length > 0 && <span className="status-badge new">Substituir por novas</span>}
              </div>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="imagensMobile"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  id="edit-mobile"
                  disabled={loading}
                />
                <label htmlFor="edit-mobile" className={`btn-upload secondary ${loading ? 'disabled' : ''}`}>
                  {formData.imagensMobile.length > 0 
                    ? `${formData.imagensMobile.length} novos arquivos` 
                    : 'Substituir Mobile'}
                </label>
              </div>
            </div>

            {/* Desktop */}
            <div className="form-group upload-box">
              <div className="label-with-status">
                <label><Monitor size={16} /> Desktop (Múltiplas)</label>
                {item.desktop_images_urls?.length > 0 && formData.imagensDesktop.length === 0 && (
                  <span className="status-badge current">{item.desktop_images_urls.length} imgs atuais</span>
                )}
                {formData.imagensDesktop.length > 0 && <span className="status-badge new">Substituir por novas</span>}
              </div>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="imagensDesktop"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  id="edit-desktop"
                  disabled={loading}
                />
                <label htmlFor="edit-desktop" className={`btn-upload secondary ${loading ? 'disabled' : ''}`}>
                  {formData.imagensDesktop.length > 0 
                    ? `${formData.imagensDesktop.length} novos arquivos` 
                    : 'Substituir Desktop'}
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Tecnologias (Tecle Enter para adicionar)</label>
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
                <>
                  <Save size={18} /> Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalEditarPortfolio