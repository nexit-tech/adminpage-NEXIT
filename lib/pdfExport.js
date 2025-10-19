import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportarRelatorioPDF(transacoes, filtro, resumo) {
  const doc = new jsPDF()
  
  // Título
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Relatório Financeiro', 14, 22)
  
  // Data de geração
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const dataGeracao = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`Gerado em: ${dataGeracao}`, 14, 28)
  
  // Filtro aplicado
  let filtroTexto = 'Todas as transações'
  if (filtro === 'entrada') filtroTexto = 'Somente Entradas'
  if (filtro === 'saida') filtroTexto = 'Somente Saídas'
  doc.text(`Filtro: ${filtroTexto}`, 14, 34)
  
  // Resumo financeiro
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo', 14, 44)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }
  
  let yPosition = 50
  
  if (filtro === 'todas' || filtro === 'entrada') {
    doc.setTextColor(22, 163, 74) // Verde
    doc.text(`Entradas: ${formatarValor(resumo.entradas)}`, 14, yPosition)
    yPosition += 6
  }
  
  if (filtro === 'todas' || filtro === 'saida') {
    doc.setTextColor(239, 68, 68) // Vermelho
    doc.text(`Saídas: ${formatarValor(resumo.saidas)}`, 14, yPosition)
    yPosition += 6
  }
  
  if (filtro === 'todas') {
    doc.setTextColor(59, 130, 246) // Azul
    doc.text(`Saldo: ${formatarValor(resumo.saldo)}`, 14, yPosition)
    yPosition += 6
  }
  
  doc.setTextColor(0, 0, 0) // Preto
  yPosition += 6
  
  // Tabela de transações
  const colunas = [
    { header: 'Tipo', dataKey: 'tipo' },
    { header: 'Data', dataKey: 'data' },
    { header: 'Descrição', dataKey: 'descricao' },
    { header: 'Categoria', dataKey: 'categoria' },
    { header: 'Projeto', dataKey: 'projeto' },
    { header: 'Valor', dataKey: 'valor' }
  ]
  
  const linhas = transacoes.map(t => ({
    tipo: t.type === 'entrada' ? 'Entrada' : 'Saída',
    data: new Date(t.transaction_date).toLocaleDateString('pt-BR'),
    descricao: t.description,
    categoria: t.category,
    projeto: t.projects?.project_name || '-',
    valor: formatarValor(t.amount)
  }))
  
  autoTable(doc, {
    startY: yPosition,
    head: [colunas.map(col => col.header)],
    body: linhas.map(row => colunas.map(col => row[col.dataKey])),
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [59, 130, 246],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    didParseCell: function(data) {
      // Colorir coluna de tipo
      if (data.column.index === 0 && data.section === 'body') {
        if (data.cell.raw === 'Entrada') {
          data.cell.styles.textColor = [22, 163, 74] // Verde
          data.cell.styles.fontStyle = 'bold'
        } else {
          data.cell.styles.textColor = [239, 68, 68] // Vermelho
          data.cell.styles.fontStyle = 'bold'
        }
      }
      
      // Colorir coluna de valor
      if (data.column.index === 5 && data.section === 'body') {
        const tipo = linhas[data.row.index].tipo
        if (tipo === 'Entrada') {
          data.cell.styles.textColor = [22, 163, 74]
          data.cell.styles.fontStyle = 'bold'
        } else {
          data.cell.styles.textColor = [239, 68, 68]
          data.cell.styles.fontStyle = 'bold'
        }
      }
    },
    margin: { top: yPosition }
  })
  
  // Rodapé
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
  
  // Nome do arquivo
  const nomeArquivo = `relatorio-financeiro-${filtroTexto.toLowerCase().replace(/ /g, '-')}-${Date.now()}.pdf`
  
  // Salvar PDF
  doc.save(nomeArquivo)
}