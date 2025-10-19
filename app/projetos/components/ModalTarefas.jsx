'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useProjetosContext } from '../ProjetosContext'
import { useTarefas } from './tarefas/useTarefas'
import BarraProgresso from './tarefas/BarraProgresso'
import ItemTarefa from './tarefas/ItemTarefa'
import ModalNovaTarefa from './ModalNovaTarefa'
import './ModalTarefas.css'

export default function ModalTarefas({ projeto, onClose }) {
  const { dispararAtualizacao } = useProjetosContext()
  const [modalNovaAberto, setModalNovaAberto] = useState(false)
  const [tarefaPaiId, setTarefaPaiId] = useState(null)

  const {
    tarefas,
    loading,
    progresso,
    toggleTarefa,
    toggleSubtarefa,
    adicionarTarefa,
    removerTarefa,
    removerSubtarefa
  } = useTarefas(projeto.id, dispararAtualizacao)

  const handleAdicionarTarefa = async (novaTarefa) => {
    try {
      await adicionarTarefa(novaTarefa.titulo, tarefaPaiId)
      setModalNovaAberto(false)
      setTarefaPaiId(null)
    } catch (error) {
      alert('Erro ao adicionar tarefa')
    }
  }

  const abrirModalSubtarefa = (tarefaId) => {
    setTarefaPaiId(tarefaId)
    setModalNovaAberto(true)
  }

  const abrirModalTarefa = () => {
    setTarefaPaiId(null)
    setModalNovaAberto(true)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-tarefas" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Tarefas do Projeto</h2>
            <p className="projeto-nome">{projeto.nome}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <BarraProgresso progresso={progresso} />

        <div className="tarefas-body">
          {loading ? (
            <div className="tarefas-vazio">
              <p>Carregando tarefas...</p>
            </div>
          ) : tarefas.length === 0 ? (
            <div className="tarefas-vazio">
              <p>Nenhuma tarefa cadastrada ainda.</p>
              <p className="subtitulo">Comece adicionando tarefas ao projeto!</p>
            </div>
          ) : (
            <div className="tarefas-lista">
              {tarefas.map(tarefa => (
                <ItemTarefa
                  key={tarefa.id}
                  tarefa={tarefa}
                  onToggle={() => toggleTarefa(tarefa.id)}
                  onDelete={() => removerTarefa(tarefa.id)}
                  onAddSubtask={() => abrirModalSubtarefa(tarefa.id)}
                  onToggleSubtask={(subtarefaId) => toggleSubtarefa(tarefa.id, subtarefaId)}
                  onDeleteSubtask={(subtarefaId) => removerSubtarefa(tarefa.id, subtarefaId)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-adicionar-tarefa" onClick={abrirModalTarefa}>
            <Plus size={18} />
            Nova Tarefa
          </button>
          <div className="footer-actions">
            <button className="btn-cancelar" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>

        {modalNovaAberto && (
          <ModalNovaTarefa 
            onClose={() => {
              setModalNovaAberto(false)
              setTarefaPaiId(null)
            }}
            onSave={handleAdicionarTarefa}
            tipo={tarefaPaiId ? 'subtarefa' : 'tarefa'}
          />
        )}
      </div>
    </div>
  )
}