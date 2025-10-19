import './CardResumo.css'

export default function CardResumo({ titulo, valor, icone, tipo }) {
  const formatarValor = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val)
  }

  return (
    <div className={`card-resumo ${tipo}`}>
      <div className="card-resumo-header">
        <h3>{titulo}</h3>
        <div className="card-resumo-icone">
          {icone}
        </div>
      </div>
      <div className="card-resumo-valor">
        {formatarValor(valor)}
      </div>
    </div>
  )
}