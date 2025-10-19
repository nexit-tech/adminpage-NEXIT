import { Trash2, ArrowUpCircle, ArrowDownCircle, FileText, Eye } from 'lucide-react'
import './TabelaTransacoes.css'

export default function TabelaTransacoes({ transacoes, loading, onDelete }) {
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data) => {
  // Forçar interpretação como data local, não UTC
  const [ano, mes, dia] = data.split('T')[0].split('-')
  const dataLocal = new Date(ano, mes - 1, dia)
  return dataLocal.toLocaleDateString('pt-BR')
}

  const abrirComprovante = (url) => {
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="tabela-container">
        <p className="tabela-loading">Carregando transações...</p>
      </div>
    )
  }

  if (transacoes.length === 0) {
    return (
      <div className="tabela-container">
        <p className="tabela-vazia">Nenhuma transação registrada ainda.</p>
      </div>
    )
  }

  return (
    <div className="tabela-container">
      <table className="tabela-transacoes">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Projeto</th>
            <th>Data</th>
            <th>Valor</th>
            <th>Comprovante</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map(transacao => (
            <tr key={transacao.id}>
              <td>
                <div className={`tipo-badge ${transacao.type}`}>
                  {transacao.type === 'entrada' ? (
                    <ArrowUpCircle size={18} />
                  ) : (
                    <ArrowDownCircle size={18} />
                  )}
                  <span>{transacao.type === 'entrada' ? 'Entrada' : 'Saída'}</span>
                </div>
              </td>
              <td className="descricao">{transacao.description}</td>
              <td>{transacao.category}</td>
              <td>{transacao.projects?.project_name || '-'}</td>
              <td>{formatarData(transacao.transaction_date)}</td>
              <td className={`valor ${transacao.type}`}>
                {transacao.type === 'entrada' ? '+' : '-'} {formatarValor(transacao.amount)}
              </td>
              <td>
                {transacao.receipt_url ? (
                  <button
                    className="btn-ver-comprovante"
                    onClick={() => abrirComprovante(transacao.receipt_url)}
                    title="Ver comprovante"
                  >
                    <Eye size={16} />
                    <span>Ver</span>
                  </button>
                ) : (
                  <span className="sem-comprovante">-</span>
                )}
              </td>
              <td>
                <button
                  className="btn-deletar-transacao"
                  onClick={() => onDelete(transacao.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}