'use client'
import { useState, useEffect } from 'react'
import { Search, Eye, Trash2 } from 'lucide-react'
import './clientes.css'
import ModalVisualizarLead from './components/ModalVisualizarLead'
import ModalExcluirLead from './components/ModalExcluirLead'
import withAuth from '../../HOC/withAuth'
import { supabase } from '@/lib/supabase'

function ClientesPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [leadSelecionado, setLeadSelecionado] = useState(null)

  useEffect(() => {
    carregarLeads()
  }, [])

  const carregarLeads = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
      alert('Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }

  const excluirLead = async (id) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await carregarLeads()
      setModalExcluirAberto(false)
      setLeadSelecionado(null)
    } catch (error) {
      console.error('Erro ao excluir lead:', error)
      alert('Erro ao excluir lead')
    }
  }

  const atualizarStatus = async (id, novoStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: novoStatus })
        .eq('id', id)

      if (error) throw error
      await carregarLeads()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const leadsFiltrados = leads.filter(lead => {
    const matchBusca = lead.company.toLowerCase().includes(busca.toLowerCase()) ||
                       lead.name.toLowerCase().includes(busca.toLowerCase()) ||
                       lead.email.toLowerCase().includes(busca.toLowerCase())
    
    const matchStatus = filtroStatus === 'todos' || lead.status === filtroStatus
    
    return matchBusca && matchStatus
  })

  const estatisticas = {
    total: leads.length,
    novos: leads.filter(l => l.status === 'novo').length,
    emNegociacao: leads.filter(l => l.status === 'em_negociacao').length,
    fechados: leads.filter(l => l.status === 'fechado').length
  }

  const traduzirTamanho = (size) => {
    const mapa = {
      'small': '1-10 pessoas',
      'medium': '11-50 pessoas',
      'large': '51+ pessoas'
    }
    return mapa[size] || size
  }

  const traduzirOrcamento = (budget) => {
    const mapa = {
      'small': 'R$ 5 mil - R$ 15 mil',
      'medium': 'R$ 15 mil - R$ 40 mil',
      'large': 'R$ 40 mil - R$ 80 mil',
      'enterprise': 'R$ 80 mil - R$ 150 mil',
      'custom': 'Acima de R$ 150 mil',
      'flexible': 'Flexível / A definir'
    }
    return mapa[budget] || budget
  }

  const traduzirPrazo = (timeline) => {
    const mapa = {
      'urgent': 'Urgente',
      'short': '1 a 2 meses',
      'medium': '3 a 6 meses',
      'flexible': 'Flexível'
    }
    return mapa[timeline] || timeline
  }

  const traduzirNecessidades = (needs) => {
    const mapa = {
      'automation': 'Automação de Processos',
      'integration': 'Integração de Sistemas',
      'crm': 'CRM Personalizado',
      'dashboard': 'Dashboards e BI',
      'ecommerce': 'E-commerce',
      'documentation': 'Sistema de Gestão',
      'chatbot': 'Chatbot/Atendimento',
      'scale': 'Escalar Operações'
    }
    return needs.map(n => mapa[n] || n)
  }

  const traduzirPlataformas = (platforms) => {
    const mapa = {
      'web': 'Web Responsivo',
      'desktop': 'Desktop',
      'mobile': 'Mobile Nativo'
    }
    return platforms.map(p => mapa[p] || p)
  }

  const traduzirContatoPreferido = (contacts) => {
    const mapa = {
      'whatsapp': 'WhatsApp',
      'email': 'E-mail',
      'discord': 'Discord',
      'instagram': 'Instagram',
      'linkedin': 'LinkedIn'
    }
    return contacts.map(c => mapa[c] || c)
  }

  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <h1>Gestão de Leads</h1>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-valor">{estatisticas.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <div className="stat-valor">{estatisticas.novos}</div>
            <div className="stat-label">Novos</div>
          </div>
          <div className="stat-item">
            <div className="stat-valor">{estatisticas.emNegociacao}</div>
            <div className="stat-label">Em Negociação</div>
          </div>
          <div className="stat-item">
            <div className="stat-valor">{estatisticas.fechados}</div>
            <div className="stat-label">Fechados</div>
          </div>
        </div>
      </div>

      <div className="filtros-container">
        <div className="filtro-busca">
          <Search className="busca-icon" size={20} />
          <input
            type="text"
            className="input-busca"
            placeholder="Buscar por empresa, nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filtro-status">
          <button
            className={`status-btn ${filtroStatus === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('todos')}
          >
            Todos
          </button>
          <button
            className={`status-btn ${filtroStatus === 'novo' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('novo')}
          >
            Novos
          </button>
          <button
            className={`status-btn ${filtroStatus === 'contatado' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('contatado')}
          >
            Contatados
          </button>
          <button
            className={`status-btn ${filtroStatus === 'em_negociacao' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('em_negociacao')}
          >
            Em Negociação
          </button>
          <button
            className={`status-btn ${filtroStatus === 'fechado' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('fechado')}
          >
            Fechados
          </button>
          <button
            className={`status-btn ${filtroStatus === 'perdido' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('perdido')}
          >
            Perdidos
          </button>
        </div>
      </div>

      <div className="tabela-container">
        {loading ? (
          <p className="tabela-loading">Carregando leads...</p>
        ) : leadsFiltrados.length === 0 ? (
          <p className="tabela-vazia">Nenhum lead encontrado.</p>
        ) : (
          <table className="tabela-clientes">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Contato</th>
                <th>Necessidades</th>
                <th>Orçamento</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {leadsFiltrados.map(lead => (
                <tr key={lead.id} onClick={() => {
                  setLeadSelecionado(lead)
                  setModalVisualizarAberto(true)
                }}>
                  <td>
                    <div className="empresa-info">
                      <span className="empresa-nome">{lead.company}</span>
                      <span className="empresa-tamanho">{traduzirTamanho(lead.company_size)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{lead.name}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.email}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="necessidades-lista">
                      {traduzirNecessidades(lead.needs).slice(0, 2).map((need, idx) => (
                        <span key={idx} className="necessidade-tag">{need}</span>
                      ))}
                      {lead.needs.length > 2 && (
                        <span className="necessidade-tag">+{lead.needs.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {traduzirOrcamento(lead.budget)}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {traduzirPrazo(lead.timeline)}
                  </td>
                  <td>
                    <span className={`status-badge ${lead.status}`}>
                      {lead.status === 'novo' && 'Novo'}
                      {lead.status === 'contatado' && 'Contatado'}
                      {lead.status === 'em_negociacao' && 'Em Negociação'}
                      {lead.status === 'fechado' && 'Fechado'}
                      {lead.status === 'perdido' && 'Perdido'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <div className="btn-acoes" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-visualizar"
                        onClick={() => {
                          setLeadSelecionado(lead)
                          setModalVisualizarAberto(true)
                        }}
                        title="Visualizar"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="btn-deletar"
                        onClick={() => {
                          setLeadSelecionado(lead)
                          setModalExcluirAberto(true)
                        }}
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalVisualizarAberto && leadSelecionado && (
        <ModalVisualizarLead
          lead={leadSelecionado}
          onClose={() => {
            setModalVisualizarAberto(false)
            setLeadSelecionado(null)
          }}
          onAtualizarStatus={atualizarStatus}
          traduzirTamanho={traduzirTamanho}
          traduzirOrcamento={traduzirOrcamento}
          traduzirPrazo={traduzirPrazo}
          traduzirNecessidades={traduzirNecessidades}
          traduzirPlataformas={traduzirPlataformas}
          traduzirContatoPreferido={traduzirContatoPreferido}
        />
      )}

      {modalExcluirAberto && leadSelecionado && (
        <ModalExcluirLead
          lead={leadSelecionado}
          onClose={() => {
            setModalExcluirAberto(false)
            setLeadSelecionado(null)
          }}
          onConfirm={() => excluirLead(leadSelecionado.id)}
        />
      )}
    </div>
  )
}

export default withAuth(ClientesPage)