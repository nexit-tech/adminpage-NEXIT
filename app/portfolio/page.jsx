'use client'
import { useState, useEffect } from 'react'
import { Plus, Eye, Edit2, Trash2, Star, ExternalLink } from 'lucide-react'
import './portfolio.css'
import ModalNovoPortfolio from './components/ModalNovoPortfolio'
import ModalEditarPortfolio from './components/ModalEditarPortfolio'
import ModalVisualizarPortfolio from './components/ModalVisualizarPortfolio'
import ModalExcluirPortfolio from './components/ModalExcluirPortfolio'
import withAuth from '../../HOC/withAuth'
import { 
  fetchPortfolio, 
  createPortfolioItem, 
  updatePortfolioItem, 
  deletePortfolioItem,
  deletePortfolioCover,
  deletePortfolioPdf,
  uploadPortfolioCover,
  uploadPortfolioPdf
} from '@/lib/supabaseQueries'

function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState(null)

  useEffect(() => {
    carregarPortfolio()
  }, [])

  const carregarPortfolio = async () => {
    setLoading(true)
    try {
      const data = await fetchPortfolio()
      setPortfolio(data)
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error)
      alert('Erro ao carregar portfólio')
    } finally {
      setLoading(false)
    }
  }

  const adicionarItem = async (dados) => {
    try {
      // Criar ID temporário para os uploads
      const tempId = Date.now().toString()
      
      // Upload da imagem de capa (obrigatório)
      const coverImageUrl = await uploadPortfolioCover(dados.imagemCapa, tempId)
      
      // Upload do PDF (opcional)
      let presentationPdfUrl = null
      if (dados.pdf) {
        presentationPdfUrl = await uploadPortfolioPdf(dados.pdf, tempId)
      }
      
      // Criar item no portfólio
      await createPortfolioItem({
        projectName: dados.projectName,
        description: dados.description,
        frameworks: dados.frameworks,
        coverImageUrl,
        presentationPdfUrl,
        projectId: null, // Não está vinculado a projeto específico
        isFeatured: false,
        displayOrder: 0
      })
      
      await carregarPortfolio()
      setModalNovoAberto(false)
    } catch (error) {
      console.error('Erro ao adicionar item:', error)
      alert('Erro ao adicionar item ao portfólio')
    }
  }

  const editarItem = async (dados) => {
    try {
      let coverImageUrl = itemSelecionado.cover_image_url
      let presentationPdfUrl = itemSelecionado.presentation_pdf_url

      // Se houver nova imagem, fazer upload e deletar a antiga
      if (dados.imagemCapa) {
        if (itemSelecionado.cover_image_url) {
          await deletePortfolioCover(itemSelecionado.cover_image_url)
        }
        coverImageUrl = await uploadPortfolioCover(dados.imagemCapa, itemSelecionado.id)
      }

      // Se houver novo PDF, fazer upload e deletar o antigo
      if (dados.pdf) {
        if (itemSelecionado.presentation_pdf_url) {
          await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
        }
        presentationPdfUrl = await uploadPortfolioPdf(dados.pdf, itemSelecionado.id)
      }

      // Se o PDF foi removido
      if (dados.removeuPdf && itemSelecionado.presentation_pdf_url) {
        await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
        presentationPdfUrl = null
      }

      await updatePortfolioItem(itemSelecionado.id, {
        projectName: dados.projectName,
        description: dados.description,
        frameworks: dados.frameworks,
        coverImageUrl,
        presentationPdfUrl,
        isFeatured: dados.isFeatured,
        displayOrder: dados.displayOrder
      })

      await carregarPortfolio()
      setModalEditarAberto(false)
      setItemSelecionado(null)
    } catch (error) {
      console.error('Erro ao editar item:', error)
      alert('Erro ao editar item do portfólio')
    }
  }

  const excluirItem = async () => {
    try {
      // Deletar arquivos do storage
      if (itemSelecionado.cover_image_url) {
        await deletePortfolioCover(itemSelecionado.cover_image_url)
      }
      if (itemSelecionado.presentation_pdf_url) {
        await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
      }
      
      // Deletar item do banco
      await deletePortfolioItem(itemSelecionado.id)
      await carregarPortfolio()
      setModalExcluirAberto(false)
      setItemSelecionado(null)
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      alert('Erro ao excluir item do portfólio')
    }
  }

  const handleVisualizar = (item) => {
    setItemSelecionado(item)
    setModalVisualizarAberto(true)
  }

  const handleEditar = (item) => {
    setItemSelecionado(item)
    setModalEditarAberto(true)
  }

  const handleExcluir = (item) => {
    setItemSelecionado(item)
    setModalExcluirAberto(true)
  }

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h1>Gerenciamento de Portfólio</h1>
        <button className="btn-novo" onClick={() => setModalNovoAberto(true)}>
          <Plus size={20} />
          Adicionar Projeto
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Carregando portfólio...</p>
        </div>
      ) : portfolio.length === 0 ? (
        <div className="portfolio-vazio">
          <p>Nenhum projeto no portfólio ainda.</p>
          <button className="btn-adicionar-vazio" onClick={() => setModalNovoAberto(true)}>
            <Plus size={20} />
            Adicionar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolio.map(item => (
            <div key={item.id} className="portfolio-card">
              {item.is_featured && (
                <div className="featured-badge">
                  <Star size={16} />
                  <span>Destaque</span>
                </div>
              )}
              
              <div className="card-image">
                {item.cover_image_url ? (
                  <img src={item.cover_image_url} alt={item.project_name} />
                ) : (
                  <div className="placeholder-image">Sem Imagem</div>
                )}
              </div>

              <div className="card-content">
                <h3 className="card-title">{item.project_name}</h3>
                <p className="card-description">{item.project_description}</p>
                
                <div className="card-frameworks">
                  {item.frameworks.map((fw, idx) => (
                    <span key={idx} className="framework-tag">{fw}</span>
                  ))}
                </div>

                {item.presentation_pdf_url && (
                  <a 
                    href={item.presentation_pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-pdf"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                    Ver Apresentação
                  </a>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="btn-action btn-visualizar"
                  onClick={() => handleVisualizar(item)}
                  title="Visualizar"
                >
                  <Eye size={18} />
                </button>
                <button 
                  className="btn-action btn-editar"
                  onClick={() => handleEditar(item)}
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  className="btn-action btn-deletar"
                  onClick={() => handleExcluir(item)}
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalNovoAberto && (
        <ModalNovoPortfolio
          onClose={() => setModalNovoAberto(false)}
          onSave={adicionarItem}
        />
      )}

      {modalEditarAberto && itemSelecionado && (
        <ModalEditarPortfolio
          item={itemSelecionado}
          onClose={() => {
            setModalEditarAberto(false)
            setItemSelecionado(null)
          }}
          onSave={editarItem}
        />
      )}

      {modalVisualizarAberto && itemSelecionado && (
        <ModalVisualizarPortfolio
          item={itemSelecionado}
          onClose={() => {
            setModalVisualizarAberto(false)
            setItemSelecionado(null)
          }}
        />
      )}

      {modalExcluirAberto && itemSelecionado && (
        <ModalExcluirPortfolio
          item={itemSelecionado}
          onClose={() => {
            setModalExcluirAberto(false)
            setItemSelecionado(null)
          }}
          onConfirm={excluirItem}
        />
      )}
    </div>
  )
}

export default withAuth(PortfolioPage)