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
  deletePortfolioImages, // <--- Importante
  uploadPortfolioCover,
  uploadPortfolioPdf,
  uploadPortfolioMobileImages, // <--- Importante
  uploadPortfolioDesktopImages // <--- Importante
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
      setPortfolio(data)
    } catch (err) {
      console.error('❌ Erro ao carregar portfólio:', err)
      error('Erro ao carregar portfólio.')
    } finally {
      setLoading(false)
    }
  }

  const adicionarItem = async (dados) => {
    try {
      console.log('📝 Iniciando criação...')
      const tempId = Date.now().toString()
      
      // 1. Upload Capa
      console.log('📤 Upload Capa...')
      const coverImageUrl = await uploadPortfolioCover(dados.imagemCapa, tempId)
      
      // 2. Upload Mobile (Se houver)
      let mobileImagesUrls = []
      if (dados.imagensMobile && dados.imagensMobile.length > 0) {
        console.log('📤 Upload Mobile...')
        mobileImagesUrls = await uploadPortfolioMobileImages(dados.imagensMobile, tempId)
      }
      
      // 3. Upload Desktop (Se houver)
      let desktopImagesUrls = []
      if (dados.imagensDesktop && dados.imagensDesktop.length > 0) {
        console.log('📤 Upload Desktop...')
        desktopImagesUrls = await uploadPortfolioDesktopImages(dados.imagensDesktop, tempId)
      }
      
      // 4. Upload PDF (Se houver)
      let presentationPdfUrl = null
      if (dados.pdf) {
        console.log('📤 Upload PDF...')
        presentationPdfUrl = await uploadPortfolioPdf(dados.pdf, tempId)
      }
      
      // 5. Salvar no Banco
      console.log('💾 Salvando no banco...')
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
      
      await carregarPortfolio()
      setModalNovoAberto(false)
      success('Projeto adicionado com sucesso!')
    } catch (err) {
      console.error('❌ Erro:', err)
      error(`Erro: ${err.message}`)
    }
  }

  const editarItem = async (dados) => {
    try {
      console.log('📝 Iniciando edição...')
      // Mantém os dados atuais se não forem alterados
      let coverImageUrl = itemSelecionado.cover_image_url
      let mobileImagesUrls = itemSelecionado.mobile_images_urls || []
      let desktopImagesUrls = itemSelecionado.desktop_images_urls || []
      let presentationPdfUrl = itemSelecionado.presentation_pdf_url

      // --- Capa ---
      if (dados.imagemCapa) {
        if (itemSelecionado.cover_image_url) {
          await deletePortfolioCover(itemSelecionado.cover_image_url)
        }
        coverImageUrl = await uploadPortfolioCover(dados.imagemCapa, itemSelecionado.id)
      }

      // --- Mobile ---
      // Se enviou novas, deleta as velhas e sobe as novas
      if (dados.imagensMobile && dados.imagensMobile.length > 0) {
        if (mobileImagesUrls.length > 0) {
          await deletePortfolioImages(mobileImagesUrls)
        }
        mobileImagesUrls = await uploadPortfolioMobileImages(dados.imagensMobile, itemSelecionado.id)
      }
      // Se apenas pediu para remover (sem enviar novas) - Lógica do seu modal precisa suportar isso
      // Assumindo que se enviou novas, substitui tudo.

      // --- Desktop ---
      if (dados.imagensDesktop && dados.imagensDesktop.length > 0) {
        if (desktopImagesUrls.length > 0) {
          await deletePortfolioImages(desktopImagesUrls)
        }
        desktopImagesUrls = await uploadPortfolioDesktopImages(dados.imagensDesktop, itemSelecionado.id)
      }

      // --- PDF ---
      if (dados.pdf) {
        if (itemSelecionado.presentation_pdf_url) {
          await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
        }
        presentationPdfUrl = await uploadPortfolioPdf(dados.pdf, itemSelecionado.id)
      }

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

      await carregarPortfolio()
      setModalEditarAberto(false)
      setItemSelecionado(null)
      success('Projeto atualizado!')
    } catch (err) {
      console.error('❌ Erro:', err)
      error(`Erro ao editar: ${err.message}`)
    }
  }

  const excluirItem = async () => {
    try {
      // Limpar Storage
      if (itemSelecionado.cover_image_url) await deletePortfolioCover(itemSelecionado.cover_image_url)
      if (itemSelecionado.presentation_pdf_url) await deletePortfolioPdf(itemSelecionado.presentation_pdf_url)
      if (itemSelecionado.mobile_images_urls?.length) await deletePortfolioImages(itemSelecionado.mobile_images_urls)
      if (itemSelecionado.desktop_images_urls?.length) await deletePortfolioImages(itemSelecionado.desktop_images_urls)
      
      // Limpar Banco
      await deletePortfolioItem(itemSelecionado.id)
      
      await carregarPortfolio()
      setModalExcluirAberto(false)
      setItemSelecionado(null)
      success('Projeto excluído!')
    } catch (err) {
      console.error('❌ Erro:', err)
      error(`Erro ao excluir: ${err.message}`)
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
          <Plus size={20} /> Adicionar Projeto
        </button>
      </div>

      {loading ? (
        <div className="loading-container"><p>Carregando...</p></div>
      ) : portfolio.length === 0 ? (
        <div className="portfolio-vazio">
          <p>Nenhum projeto ainda.</p>
          <button className="btn-adicionar-vazio" onClick={() => setModalNovoAberto(true)}>
            <Plus size={20} /> Adicionar Primeiro
          </button>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolio.map(item => (
            <div key={item.id} className="portfolio-card">
              {item.is_featured && (
                <div className="featured-badge"><Star size={16} /><span>Destaque</span></div>
              )}
              <div className="card-image">
                {item.cover_image_url ? (
                  <img src={item.cover_image_url} alt={item.project_name} />
                ) : <div className="placeholder-image">Sem Imagem</div>}
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
                  <a href={item.presentation_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-pdf" onClick={e => e.stopPropagation()}>
                    <ExternalLink size={16} /> Ver Apresentação
                  </a>
                )}
              </div>
              <div className="card-actions">
                <button className="btn-action btn-visualizar" onClick={() => handleVisualizar(item)}><Eye size={18} /></button>
                <button className="btn-action btn-editar" onClick={() => handleEditar(item)}><Edit2 size={18} /></button>
                <button className="btn-action btn-deletar" onClick={() => handleExcluir(item)}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalNovoAberto && (
        <ModalNovoPortfolio onClose={() => setModalNovoAberto(false)} onSave={adicionarItem} />
      )}
      {modalEditarAberto && itemSelecionado && (
        <ModalEditarPortfolio item={itemSelecionado} onClose={() => { setModalEditarAberto(false); setItemSelecionado(null) }} onSave={editarItem} />
      )}
      {modalVisualizarAberto && itemSelecionado && (
        <ModalVisualizarPortfolio item={itemSelecionado} onClose={() => { setModalVisualizarAberto(false); setItemSelecionado(null) }} />
      )}
      {modalExcluirAberto && itemSelecionado && (
        <ModalExcluirPortfolio item={itemSelecionado} onClose={() => { setModalExcluirAberto(false); setItemSelecionado(null) }} onConfirm={excluirItem} />
      )}
    </div>
  )
}

export default withAuth(PortfolioPage)