'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Plus, FileDown } from 'lucide-react'
import './financeiro.css'
import CardResumo from './components/CardResumo'
import TabelaTransacoes from './components/TabelaTransacoes'
import ModalNovaTransacao from './components/ModalNovaTransacao'
import DatePicker from '@/components/DatePicker'
import { fetchTransactions, createTransaction, deleteTransaction } from '@/lib/supabaseQueries'
import { exportarRelatorioPDF } from '@/lib/pdfExport'
import withAuth from '../../HOC/withAuth' // <-- ESTA É A LINHA QUE FALTAVA

function FinanceiroPage() {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('todas')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  useEffect(() => {
    carregarTransacoes()
  }, [])

  const carregarTransacoes = async () => {
    setLoading(true)
    try {
      const data = await fetchTransactions()
      console.log('Transações carregadas:', data)
      setTransacoes(data)
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setLoading(false)
    }
  }

  const adicionarTransacao = async (novaTransacao) => {
    try {
      await createTransaction(novaTransacao)
      await carregarTransacoes()
      setModalAberto(false)
    } catch (error) {
      alert('Erro ao criar transação')
    }
  }

  const excluirTransacao = async (id) => {
    if (!confirm('Deseja realmente excluir esta transação?')) return
    
    try {
      await deleteTransaction(id)
      await carregarTransacoes()
    } catch (error) {
      alert('Erro ao excluir transação')
    }
  }

  const filtrarPorData = (transacao) => {
    if (!dataInicio && !dataFim) return true
    
    // Normalizar a data da transação para formato YYYY-MM-DD
    let dataTransacaoStr = transacao.transaction_date
    
    // Se vier com timestamp, pegar só a data
    if (dataTransacaoStr.includes('T')) {
      dataTransacaoStr = dataTransacaoStr.split('T')[0]
    }
    
    console.log('Comparando:', {
      dataTransacao: dataTransacaoStr,
      dataInicio,
      dataFim,
      resultado: dataInicio && dataFim 
        ? (dataTransacaoStr >= dataInicio && dataTransacaoStr <= dataFim)
        : dataInicio 
          ? dataTransacaoStr >= dataInicio
          : dataTransacaoStr <= dataFim
    })
    
    if (dataInicio && dataFim) {
      return dataTransacaoStr >= dataInicio && dataTransacaoStr <= dataFim
    } else if (dataInicio) {
      return dataTransacaoStr >= dataInicio
    } else if (dataFim) {
      return dataTransacaoStr <= dataFim
    }
    
    return true
  }

  const calcularResumo = (transacoesFiltradas) => {
    const entradas = transacoesFiltradas
      .filter(t => t.type === 'entrada')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0)
    
    const saidas = transacoesFiltradas
      .filter(t => t.type === 'saida')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0)
    
    return {
      entradas,
      saidas,
      saldo: entradas - saidas
    }
  }

  const handleExportarPDF = () => {
    const resumo = calcularResumo(transacoesFiltradas)
    exportarRelatorioPDF(transacoesFiltradas, filtroTipo, resumo)
  }

  const limparFiltroData = () => {
    setDataInicio('')
    setDataFim('')
  }

  const transacoesFiltradas = transacoes
    .filter(t => filtroTipo === 'todas' ? true : t.type === filtroTipo)
    .filter(filtrarPorData)

  console.log('Filtros ativos:', { filtroTipo, dataInicio, dataFim })
  console.log('Total transações:', transacoes.length)
  console.log('Transações filtradas:', transacoesFiltradas.length)

  const resumo = calcularResumo(transacoesFiltradas)

  return (
    <div className="financeiro-page">
      <div className="financeiro-header">
        <h1>Gestão Financeira</h1>
        <div className="header-actions">
          <button className="btn-exportar" onClick={handleExportarPDF}>
            <FileDown size={20} />
            Exportar PDF
          </button>
          <button className="btn-novo" onClick={() => setModalAberto(true)}>
            <Plus size={20} />
            Nova Transação
          </button>
        </div>
      </div>

      <div className="resumo-cards">
        <CardResumo
          titulo="Entradas"
          valor={resumo.entradas}
          icone={<TrendingUp />}
          tipo="entrada"
        />
        <CardResumo
          titulo="Saídas"
          valor={resumo.saidas}
          icone={<TrendingDown />}
          tipo="saida"
        />
        <CardResumo
          titulo="Saldo"
          valor={resumo.saldo}
          icone={<DollarSign />}
          tipo="saldo"
        />
      </div>

      <div className="filtros-container">
        <div className="financeiro-filtros">
          <button
            className={`filtro-btn ${filtroTipo === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('todas')}
          >
            Todas
          </button>
          <button
            className={`filtro-btn ${filtroTipo === 'entrada' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('entrada')}
          >
            Entradas
          </button>
          <button
            className={`filtro-btn ${filtroTipo === 'saida' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('saida')}
          >
            Saídas
          </button>
        </div>

        <div className="filtros-data">
          <DatePicker
            label="Data Início"
            value={dataInicio}
            onChange={(value) => {
              console.log('Data Início selecionada:', value)
              setDataInicio(value)
            }}
            placeholder="Data inicial"
          />
          <DatePicker
            label="Data Fim"
            value={dataFim}
            onChange={(value) => {
              console.log('Data Fim selecionada:', value)
              setDataFim(value)
            }}
            placeholder="Data final"
          />
          {(dataInicio || dataFim) && (
            <button className="btn-limpar-filtro" onClick={limparFiltroData}>
              Limpar
            </button>
          )}
        </div>
      </div>

      <TabelaTransacoes
        transacoes={transacoesFiltradas}
        loading={loading}
        onDelete={excluirTransacao}
      />

      {modalAberto && (
        <ModalNovaTransacao
          onClose={() => setModalAberto(false)}
          onSave={adicionarTransacao}
        />
      )}
    </div>
  )
}

export default withAuth(FinanceiroPage)