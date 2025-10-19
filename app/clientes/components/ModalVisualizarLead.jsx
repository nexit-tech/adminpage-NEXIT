'use client'
import { useState } from 'react'
import './ModalVisualizarLead.css'

export default function ModalVisualizarLead({ 
  lead, 
  onClose, 
  onAtualizarStatus,
  traduzirTamanho,
  traduzirOrcamento,
  traduzirPrazo,
  traduzirNecessidades,
  traduzirPlataformas,
  traduzirContatoPreferido
}) {
  const [status, setStatus] = useState(lead.status)

  const handleSalvarStatus = async () => {
    await onAtualizarStatus(lead.id, status)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-visualizar-lead" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Detalhes do Lead</h2>
            <p className="modal-subtitle">{lead.company}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Informações da Empresa */}
          <section className="info-section">
            <h3 className="section-title">Informações da Empresa</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Empresa</span>
                <span className="info-value">{lead.company}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tamanho da Equipe</span>
                <span className="info-value">{traduzirTamanho(lead.company_size)}</span>
              </div>
            </div>
          </section>

          {/* Contato */}
          <section className="info-section">
            <h3 className="section-title">Contato</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nome</span>
                <span className="info-value">{lead.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">E-mail</span>
                <span className="info-value">{lead.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Telefone</span>
                <span className="info-value">{lead.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Contato Preferido</span>
                <div className="tags-list">
                  {traduzirContatoPreferido(lead.preferred_contact).map((contact, idx) => (
                    <span key={idx} className="tag">{contact}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projeto */}
          <section className="info-section">
            <h3 className="section-title">Projeto</h3>
            <div className="info-grid">
              <div className="info-item full-width">
                <span className="info-label">Descrição</span>
                <p className="info-description">{lead.description}</p>
              </div>
              <div className="info-item">
                <span className="info-label">Orçamento</span>
                <span className="info-value">{traduzirOrcamento(lead.budget)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Prazo</span>
                <span className="info-value">{traduzirPrazo(lead.timeline)}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Necessidades</span>
                <div className="tags-list">
                  {traduzirNecessidades(lead.needs).map((need, idx) => (
                    <span key={idx} className="tag">{need}</span>
                  ))}
                </div>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Plataformas</span>
                <div className="tags-list">
                  {traduzirPlataformas(lead.platforms).map((platform, idx) => (
                    <span key={idx} className="tag">{platform}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="info-section">
            <h3 className="section-title">Status</h3>
            <select 
              className="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="novo">Novo</option>
              <option value="contatado">Contatado</option>
              <option value="em_negociacao">Em Negociação</option>
              <option value="fechado">Fechado</option>
              <option value="perdido">Perdido</option>
            </select>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Fechar
          </button>
          <button className="btn-salvar" onClick={handleSalvarStatus}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}