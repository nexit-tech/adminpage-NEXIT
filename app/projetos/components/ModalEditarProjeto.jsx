'use client'
import { useState } from 'react'
import Select from '@/components/Select'
import DatePicker from '@/components/DatePicker'
import './ModalEditarProjeto.css'

export default function ModalEditarProjeto({ projeto, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: projeto.id,
    nome: projeto.nome,
    cliente: projeto.cliente,
    desenvolvedor: projeto.desenvolvedor, // NOVO
    status: projeto.status,
    prazo: projeto.prazo,
    valorProjeto: projeto.valorProjeto,
    valorEntrada: projeto.valorEntrada,
    meioContratacao: projeto.meioContratacao
  })

  const statusOptions = [
    { value: 'Planejamento', label: 'Planejamento' },
    { value: 'Em Andamento', label: 'Em Andamento' },
    { value: 'Concluído', label: 'Concluído' }
  ]

  const meioContratacaoOptions = [
    { value: 'Workana', label: 'Workana' },
    { value: 'Recontratação', label: 'Recontratação' },
    { value: 'Pessoal', label: 'Pessoal' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const projetoFormatado = {
      ...formData,
      valorProjeto: parseFloat(formData.valorProjeto),
      valorEntrada: parseFloat(formData.valorEntrada)
    }
    
    onSave(projetoFormatado)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-editar" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Projeto</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Projeto *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Website Corporativo"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nome do Cliente *</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Ex: Empresa XYZ"
                required
              />
            </div>

            <div className="form-group">
              <label>Desenvolvedor Responsável *</label>
              <input
                type="text"
                name="desenvolvedor"
                value={formData.desenvolvedor}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
            />

            <DatePicker
              label="Prazo de Entrega"
              value={formData.prazo}
              onChange={(value) => setFormData({ ...formData, prazo: value })}
              placeholder="Selecione a data"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor do Projeto *</label>
              <input
                type="number"
                name="valorProjeto"
                value={formData.valorProjeto}
                onChange={handleChange}
                placeholder="15000.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Valor de Entrada *</label>
              <input
                type="number"
                name="valorEntrada"
                value={formData.valorEntrada}
                onChange={handleChange}
                placeholder="7500.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <Select
            label="Meio de Contratação"
            options={meioContratacaoOptions}
            value={formData.meioContratacao}
            onChange={(value) => setFormData({ ...formData, meioContratacao: value })}
          />

          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}