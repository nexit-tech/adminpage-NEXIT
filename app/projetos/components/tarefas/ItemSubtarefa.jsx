import { Trash2 } from 'lucide-react'
import './ItemSubtarefa.css'

export default function ItemSubtarefa({ subtarefa, onToggle, onDelete }) {
  return (
    <div className="subtarefa-item">
      <div className="tarefa-checkbox-area">
        <input
          type="checkbox"
          checked={subtarefa.concluida}
          onChange={onToggle}
          className="custom-checkbox"
        />
        <span className={subtarefa.concluida ? 'concluida' : ''}>
          {subtarefa.titulo}
        </span>
      </div>
      <button 
        className="btn-icon btn-deletar" 
        onClick={onDelete}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}