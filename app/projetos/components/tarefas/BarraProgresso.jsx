import './BarraProgresso.css'

export default function BarraProgresso({ progresso }) {
  return (
    <div className="tarefas-progresso">
      <div className="progresso-header">
        <span className="progresso-label">Progresso Geral</span>
        <span className="progresso-valor">{progresso}%</span>
      </div>
      <div className="progresso-barra-grande">
        <div 
          className="progresso-preenchimento" 
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  )
}