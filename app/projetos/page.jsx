'use client'
import { useState, useEffect } from 'react'
import { Archive } from 'lucide-react'
import './projetos.css'
import ListaProjetos from './components/ListaProjetos'
import ModalNovoProjeto from './components/ModalNovoProjeto'
import ModalEditarProjeto from './components/ModalEditarProjeto'
import ModalExcluirProjeto from './components/ModalExcluirProjeto'
import ModalTarefas from './components/ModalTarefas'
import ModalAdicionarAoPortfolio from './components/ModalAdicionarAoPortfolio'
import { ProjetosProvider } from './ProjetosContext'
import withAuth from '../../HOC/withAuth'
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  createTransaction,
  createPortfolioItem,
  uploadPortfolioCover,
  uploadPortfolioPdf,
  uploadPortfolioMobileImages, // <--- ADICIONADO
  uploadPortfolioDesktopImages // <--- ADICIONADO
} from '@/lib/supabaseQueries'

function ProjetosContent() {
  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [modalTarefasAberto, setModalTarefasAberto] = useState(false)
  const [modalPortfolioAberto, setModalPortfolioAberto] = useState(false)
  const [projetoSelecionado, setProjetoSelecionado] = useState(null)
  const [abaAtiva, setAbaAtiva] = useState('ativos')

  useEffect(() => {
    carregarProjetos()
  }, [])

  const carregarProjetos = async () => {
    setLoading(true)
    try {
      const data = await fetchProjects()
      // Mapeamento dos dados do banco para o front
      const projetosFormatados = data.map(p => ({
        id: p.id,
        nome: p.project_name,
        cliente: p.lead_name,
        desenvolvedor: p.dev_name,
        status: p.project_status,
        prazo: p.delivery_date,
        valorProjeto: parseFloat(p.project_value),
        valorEntrada: parseFloat(p.entry_value),
        meioContratacao: p.hiring_method
      }))
      setProjetos(projetosFormatados)
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
      alert('Erro ao carregar projetos. Verifique o console.')
    } finally {
      setLoading(false)
    }
  }

  const projetosAtivos = projetos.filter(p => p.status !== 'Concluído')
  const projetosFinalizados = projetos.filter(p => p.status === 'Concluído')

  const adicionarProjeto = async (novoProjeto) => {
    try {
      const projetoCriado = await createProject(novoProjeto)
      if (novoProjeto.valorEntrada > 0) {
        await createTransaction({
          descricao: `Entrada do projeto: ${novoProjeto.nome}`,
          valor: novoProjeto.valorEntrada,
          tipo: 'entrada',
          categoria: 'Pagamento de Projeto',
          metodoPagamento: novoProjeto.meioContratacao === 'Workana' ? 'Transferência' : 'PIX',
          data: new Date().toISOString().split('T')[0],
          projetoId: projetoCriado.id
        })
      }
      await carregarProjetos()
      setModalNovoAberto(false)
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error)
      alert('Erro ao criar projeto.')
    }
  }

  const editarProjeto = async (projetoEditado) => {
    try {
      const projetoAnterior = projetos.find(p => p.id === projetoEditado.id)
      await updateProject(projetoEditado.id, projetoEditado)
      
      // Se concluiu agora, lança pagamento restante e abre modal de portfólio
      if (projetoAnterior.status !== 'Concluído' && projetoEditado.status === 'Concluído') {
        const valorRestante = projetoEditado.valorProjeto - projetoEditado.valorEntrada
        if (valorRestante > 0) {
          await createTransaction({
            descricao: `Pagamento final do projeto: ${projetoEditado.nome}`,
            valor: valorRestante,
            tipo: 'entrada',
            categoria: 'Pagamento de Projeto',
            metodoPagamento: projetoEditado.meioContratacao === 'Workana' ? 'Transferência' : 'PIX',
            data: new Date().toISOString().split('T')[0],
            projetoId: projetoEditado.id
          })
        }
        setProjetoSelecionado(projetoEditado)
        setModalPortfolioAberto(true)
      }
      
      await carregarProjetos()
      setModalEditarAberto(false)
      if (projetoAnterior.status === 'Concluído' || projetoEditado.status !== 'Concluído') {
        setProjetoSelecionado(null)
      }
    } catch (error) {
      console.error('Erro ao editar projeto:', error)
      alert('Erro ao editar projeto.')
    }
  }

  const excluirProjeto = async () => {
    try {
      await deleteProject(projetoSelecionado.id)
      await carregarProjetos()
      setModalExcluirAberto(false)
      setProjetoSelecionado(null)
    } catch (error) {
      console.error('Erro ao excluir projeto:', error)
      alert('Erro ao excluir projeto.')
    }
  }

  const adicionarAoPortfolio = async (dados) => {
    try {
      const tempId = Date.now().toString()
      
      // 1. Capa (Obrigatória)
      const coverImageUrl = await uploadPortfolioCover(dados.imagemCapa, tempId)
      
      // 2. Mobile (Opcional, Múltiplos)
      let mobileImagesUrls = []
      if (dados.imagensMobile && dados.imagensMobile.length > 0) {
        mobileImagesUrls = await uploadPortfolioMobileImages(dados.imagensMobile, tempId)
      }

      // 3. Desktop (Opcional, Múltiplos)
      let desktopImagesUrls = []
      if (dados.imagensDesktop && dados.imagensDesktop.length > 0) {
        desktopImagesUrls = await uploadPortfolioDesktopImages(dados.imagensDesktop, tempId)
      }
      
      // 4. PDF (Opcional)
      let presentationPdfUrl = null
      if (dados.pdf) {
        presentationPdfUrl = await uploadPortfolioPdf(dados.pdf, tempId)
      }
      
      // 5. Salvar
      await createPortfolioItem({
        projectName: dados.projectName,
        description: dados.description,
        frameworks: dados.frameworks,
        coverImageUrl,
        presentationPdfUrl,
        mobileImagesUrls,  // Passando os arrays corretos
        desktopImagesUrls, // Passando os arrays corretos
        projectId: dados.projectId,
        isFeatured: false,
        displayOrder: 0
      })
      
      alert('Projeto adicionado ao portfólio com sucesso!')
      setModalPortfolioAberto(false)
      setProjetoSelecionado(null)
    } catch (error) {
      console.error('Erro ao adicionar ao portfólio:', error)
      throw error
    }
  }

  const handleEditar = (projeto) => {
    setProjetoSelecionado(projeto)
    setModalEditarAberto(true)
  }

  const handleExcluir = (projeto) => {
    setProjetoSelecionado(projeto)
    setModalExcluirAberto(true)
  }

  const handleTarefas = (projeto) => {
    setProjetoSelecionado(projeto)
    setModalTarefasAberto(true)
  }

  if (loading) return <div className="projetos-page"><div className="loading-container"><p>Carregando projetos...</p></div></div>

  return (
    <div className="projetos-page">
      <div className="projetos-header">
        <h1>Gerenciamento de Projetos</h1>
        <button className="btn-novo" onClick={() => setModalNovoAberto(true)}>+ Novo Projeto</button>
      </div>

      <div className="projetos-tabs">
        <button className={`tab-btn ${abaAtiva === 'ativos' ? 'active' : ''}`} onClick={() => setAbaAtiva('ativos')}>
          <span>Projetos Ativos</span>
          <span className="tab-badge">{projetosAtivos.length}</span>
        </button>
        <button className={`tab-btn ${abaAtiva === 'finalizados' ? 'active' : ''}`} onClick={() => setAbaAtiva('finalizados')}>
          <Archive size={18} />
          <span>Projetos Finalizados</span>
          <span className="tab-badge finalizados">{projetosFinalizados.length}</span>
        </button>
      </div>

      <div className="projetos-content">
        <ListaProjetos 
          projetos={abaAtiva === 'ativos' ? projetosAtivos : projetosFinalizados} 
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onTarefas={handleTarefas}
          tipo={abaAtiva}
        />
      </div>

      {modalNovoAberto && <ModalNovoProjeto onClose={() => setModalNovoAberto(false)} onSave={adicionarProjeto} />}
      
      {modalEditarAberto && projetoSelecionado && (
        <ModalEditarProjeto 
          projeto={projetoSelecionado}
          onClose={() => { setModalEditarAberto(false); setProjetoSelecionado(null) }}
          onSave={editarProjeto}
        />
      )}

      {modalExcluirAberto && projetoSelecionado && (
        <ModalExcluirProjeto 
          projeto={projetoSelecionado}
          onClose={() => { setModalExcluirAberto(false); setProjetoSelecionado(null) }}
          onConfirm={excluirProjeto}
        />
      )}

      {modalTarefasAberto && projetoSelecionado && (
        <ModalTarefas 
          projeto={projetoSelecionado}
          onClose={() => { setModalTarefasAberto(false); setProjetoSelecionado(null) }}
        />
      )}

      {modalPortfolioAberto && projetoSelecionado && (
        <ModalAdicionarAoPortfolio
          projeto={projetoSelecionado}
          onClose={() => { setModalPortfolioAberto(false); setProjetoSelecionado(null) }}
          onSave={adicionarAoPortfolio}
        />
      )}
    </div>
  )
}

function ProjetosPage() {
  return (
    <ProjetosProvider>
      <ProjetosContent />
    </ProjetosProvider>
  )
}

export default withAuth(ProjetosPage)