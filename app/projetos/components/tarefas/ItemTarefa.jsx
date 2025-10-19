import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import ItemSubtarefa from './ItemSubtarefa'
import './ItemTarefa.css'

export default function ItemTarefa({ 
  tarefa, 
  onToggle, 
  onDelete, 
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask 
}) {
  const [expandida, setExpandida] = useState(false)

  return (
    <div className="tarefa-item">
      <div className="tarefa-principal">
        <div className="tarefa-checkbox-area">
          <input
            type="checkbox"
            checked={tarefa.concluida}
            onChange={onToggle}
            className="custom-checkbox"
          />
          <span className={tarefa.concluida ? 'concluida' : ''}>
            {tarefa.titulo}
          </span>
        </div>
        <div className="tarefa-acoes">
          <button 
            className="btn-icon" 
            onClick={onAddSubtask}
            title="Adicionar subtarefa"
          >
            <Plus size={16} />
          </button>
          {tarefa.subtarefas && tarefa.subtarefas.length > 0 && (
            <button 
              className="btn-icon" 
              onClick={() => setExpandida(!expandida)}
            >
              {expandida ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <button 
            className="btn-icon btn-deletar" 
            onClick={onDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {expandida && tarefa.subtarefas && tarefa.subtarefas.length > 0 && (
        <div className="subtarefas-lista">
          {tarefa.subtarefas.map(subtarefa => (
            <ItemSubtarefa
              key={subtarefa.id}
              subtarefa={subtarefa}
              onToggle={() => onToggleSubtask(subtarefa.id)}
              onDelete={() => onDeleteSubtask(subtarefa.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}