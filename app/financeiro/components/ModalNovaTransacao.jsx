'use client'
import { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import Select from '@/components/Select'
import DatePicker from '@/components/DatePicker'
import { uploadComprovante } from '@/lib/supabaseQueries'
import './ModalNovaTransacao.css'

export default function ModalNovaTransacao({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'entrada',
    categoria: '',
    data: ''
  })
  const [arquivo, setArquivo] = useState(null)
  const [uploading, setUploading] = useState(false)

  const tipoOptions = [
    { value: 'entrada', label: 'Entrada' },
    { value: 'saida', label: 'Saída' }
  ]

  const handleArquivoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Tamanho máximo: 5MB')
        return
      }
      
      // Validar tipo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!tiposPermitidos.includes(file.type)) {
        alert('Tipo de arquivo não permitido. Use: JPG, PNG ou PDF')
        return
      }
      
      setArquivo(file)
    }
  }

  const removerArquivo = () => {
    setArquivo(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let comprovanteUrl = null

      // Se houver arquivo, fazer upload primeiro
      if (arquivo) {
        // Criar ID temporário para o nome do arquivo
        const tempId = Date.now().toString()
        comprovanteUrl = await uploadComprovante(arquivo, tempId)
      }

      await onSave({
        ...formData,
        valor: parseFloat(formData.valor),
        metodoPagamento: null,
        projetoId: null,
        comprovanteUrl
      })
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar transação')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Transação</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <Select
            label="Tipo"
            options={tipoOptions}
            value={formData.tipo}
            onChange={(value) => setFormData({ ...formData, tipo: value })}
            required
          />

          <div className="form-group">
            <label>Categoria *</label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ex: Pagamento de Projeto, Hospedagem, Marketing..."
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição *</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Ex: Pagamento entrada projeto Website"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor *</label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <DatePicker
              label="Data"
              value={formData.data}
              onChange={(value) => setFormData({ ...formData, data: value })}
              placeholder="Selecione a data"
              required
            />
          </div>

          {/* Upload de Comprovante */}
          <div className="form-group">
            <label>Comprovante (opcional)</label>
            
            {!arquivo ? (
              <label className="upload-area">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleArquivoChange}
                  style={{ display: 'none' }}
                />
                <Upload size={24} />
                <span>Clique para anexar comprovante</span>
                <span className="upload-hint">JPG, PNG ou PDF (máx. 5MB)</span>
              </label>
            ) : (
              <div className="arquivo-selecionado">
                <FileText size={20} />
                <span>{arquivo.name}</span>
                <button type="button" onClick={removerArquivo} className="btn-remover">
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
              {uploading ? 'Salvando...' : 'Salvar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}