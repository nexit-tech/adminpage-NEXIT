'use client'
import { useState, useEffect } from 'react'
import { Plus, Eye, Edit2, Trash2, Star, ExternalLink } from 'lucide-react'
import './portfolio.css'
import ModalNovoPortfolio from './components/ModalNovoPortfolio'
import ModalEditarPortfolio from './components/ModalEditarPortfolio'
import ModalVisualizarPortfolio from './components/ModalVisualizarPortfolio'
import ModalExcluirPortfolio from './components/ModalExcluirPortfolio'
import Toast from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
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
  
  const { toasts, success, error, removerToast } = useToast()

  useEffect(() => {
    carregarPortfolio()
  }, [])

  const carregarPortfolio = async () => {
    setLoading(true)
    try {
      console.log('🔄 Carregando portfólio...')
      const data = await fetchPortfolio()
      console.log('✅ Portfólio carregado:', data.length, 'itens')
      setPortfolio(data)
    } catch (err) {
      console.error('❌ Erro ao carregar portfólio:', err)
      error('Erro ao carregar portfólio. Verifique o console.')
    } finally {
      setLoading(false)
    }
  }

  // app/portfolio/page.jsx - APENAS A FUNÇÃO adicionarItem
const adicionarItem = async (dados) => {
  try {
    console.log('📝 Iniciando criação de item do portfólio...')
    
    const tempId = Date.now().toString()
    
    console.log('📤 Fazendo upload da imagem de capa...')
    const coverImageUrl = await uploadPortfolioCover(dados.imagemCapa, tempId)
    console.log('✅ Imagem de capa enviada:', coverImageUrl)
    
    let mobileImagesUrls = []
    if (dados.imagensMobile && dados.imagensMobile.length > 0) {
      console.log('📤 Fazendo upload das imagens mobile...')
      mobileImagesUrls = await uploadPortfolioMobileImages(dados.imagensMobile, tempId)
      console.log('✅ Imagens mobile enviadas:', mobileImagesUrls.length)
    }
    
    let desktopImagesUrls = []
    if (dados.imagensDesktop && dados.imagensDesktop.length > 0) {
      console.log('📤 Fazendo upload das imagens desktop...')
      desktopImagesUrls = await uploadPortfolioDesktopImages(dados.imagensDesktop, tempId)
      console.log('✅ Imagens desktop enviadas:', desktopImagesUrls.length)
    }
    
    let presentationPdfUrl = null
    if (dados.pdf) {
      console.log('📤 Fazendo upload do PDF...')
      presentationPdfUrl = await uploadPortfolioPdf(dados.pdf, tempId)
      console.log('✅ PDF enviado:', presentationPdfUrl)
    }
    
    console.log('💾 Salvando item no banco de dados...')
    await createPortfolioItem({
      projectName: dados.projectName,
      description: dados.description,
      frameworks: dados.frameworks,
      coverImageUrl,
      presentationPdfUrl,
      mobileImagesUrls,
      desktopImagesUrls,
      projectId: null,
      isFeatured: false,
      displayOrder: 0
    })
    
    console.log('✅ Item adicionado com sucesso!')
    await carregarPortfolio()
    setModalNovoAberto(false)
    success('Projeto adicionado ao portfólio com sucesso!')
  } catch (err) {
    console.error('❌ Erro completo ao adicionar item:', err)
    error(`Erro ao adicionar projeto: ${err.message}`)
  }
}

const editarItem = async (dados) => {
  try {
    console.log('📝 Iniciando edição de item do portfólio...')
    let coverImageUrl = itemSelecionado.cover_image_url
    let mobileImagesUrls = itemSelecionado.mobile_images_urls || []
    let desktopImagesUrls = itemSelecionado.desktop_images_urls || []
    let presentationPdfUrl = itemSelecionado.presentation_pdf_url

    if (dados.imagemCapa) {
      console.log('📤 Fazendo upload da nova imagem...')
      if (itemSelecionado.cover_image_url) {
        console.log('🗑️ Deletando imagem antiga...')
        await deletePortfolioCover(itemSelecionado.cover_image_url)
      }
      coverImageUrl = await uploadPortfolioCover(dados.imagemCapa, itemSelecionado.id)
      console.log('✅ Nova imagem enviada:', coverImageUrl)
    }

    if (dados.imagensMobile && dados.imagensMobile.length > 0) {
      console.log('📤 Fazendo upload das novas imagens mobile...')
      if (mobileImagesUrls.length > 0) {
        console.log('🗑️ Deletando imagens mobile antigas...')
        await deletePortfolioImages(mobileImagesUrls)
      }
      mobileImagesUrls = await uploadPortfolioMobileImages(dados.imagensMobile, itemSelecionado.id)
      console.log('✅ Novas imagens mobile enviadas:', mobileImagesUrls.length)
    }

    if (dados.removeuImagensMobile && mobileImagesUrls.length > 0) {
      console.log('🗑️ Removendo imagens mobile...')
      await deletePortfolioImages(mobileImagesUrls)
      mobileImagesUrls = []
    }

    if (dados.imagensDesktop && dados.imagensDesktop.length > 0) {
      console.log('📤 Fazendo upload das novas imagens desktop...')
      if (desktopImagesUrls.length > 0) {
        console.log('🗑️ Deletando imagens desktop antigas...')
        await deletePortfolioImages(desktopImagesUrls)
      }
      desktopImagesUrls = await uploadPortfolioDesktopImages(dados.imagensDesktop, itemSelecionado.id)
      console.log('✅ Novas imagens desktop enviadas:', desktopImagesUrls.length)
    }

    if (dados.removeuImagensDesktop && desktopImagesUrls.length > 0) {
      console.log('🗑️ Removendo imagens desktop...')
      await deletePortfolioImages(desktopImagesUrls)
      desktopImagesUrls = []
    }

    if (dados.pdf) {
      console.log('📤 Fazendo upload do novo PDF...')
      if (itemSelecionado.presentation_pdf_url) {
        console.log('🗑️ Deletando PDF antigo...')
        await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
      }
      presentationPdfUrl = await uploadPortfolioPdf(dados.pdf, itemSelecionado.id)
      console.log('✅ Novo PDF enviado:', presentationPdfUrl)
    }

    if (dados.removeuPdf && itemSelecionado.presentation_pdf_url) {
      console.log('🗑️ Removendo PDF...')
      await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
      presentationPdfUrl = null
    }

    console.log('💾 Atualizando item no banco de dados...')
    await updatePortfolioItem(itemSelecionado.id, {
      projectName: dados.projectName,
      description: dados.description,
      frameworks: dados.frameworks,
      coverImageUrl,
      presentationPdfUrl,
      mobileImagesUrls,
      desktopImagesUrls,
      isFeatured: dados.isFeatured,
      displayOrder: dados.displayOrder
    })

    console.log('✅ Item editado com sucesso!')
    await carregarPortfolio()
    setModalEditarAberto(false)
    setItemSelecionado(null)
    success('Projeto editado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao editar item:', err)
    error(`Erro ao editar projeto: ${err.message}`)
  }
}
  const excluirItem = async () => {
    try {
      console.log('🗑️ Iniciando exclusão de item do portfólio...')
      
      if (itemSelecionado.cover_image_url) {
        console.log('🗑️ Deletando imagem de capa...')
        await deletePortfolioCover(itemSelecionado.cover_image_url)
      }
      if (itemSelecionado.presentation_pdf_url) {
        console.log('🗑️ Deletando PDF...')
        await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
      }
      
      console.log('💾 Removendo item do banco de dados...')
      await deletePortfolioItem(itemSelecionado.id)
      
      console.log('✅ Item excluído com sucesso!')
      await carregarPortfolio()
      setModalExcluirAberto(false)
      setItemSelecionado(null)
      success('Projeto excluído do portfólio com sucesso!')
    } catch (err) {
      console.error('❌ Erro ao excluir item:', err)
      error(`Erro ao excluir projeto: ${err.message}`)
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
      {/* Toasts */}
      <div className="toasts-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            tipo={toast.tipo}
            mensagem={toast.mensagem}
            onClose={() => removerToast(toast.id)}
            duracao={toast.duracao}
          />
        ))}
      </div>

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