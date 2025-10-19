import { useState, useEffect } from 'react'
import { 
  fetchTasks, 
  fetchSubtasks, 
  createTask, 
  createSubtask, 
  updateTaskStatus, 
  updateSubtaskStatus,
  updateAllSubtasksStatus,
  deleteTask,
  deleteSubtask
} from '@/lib/supabaseQueries'

export function useTarefas(projetoId, dispararAtualizacao) {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarTarefas()
  }, [projetoId])

  const carregarTarefas = async () => {
    setLoading(true)
    try {
      const tasksData = await fetchTasks(projetoId)
      
      const tarefasComSubtarefas = await Promise.all(
        tasksData.map(async (task) => {
          const subtasksData = await fetchSubtasks(task.id)
          return {
            id: task.id,
            titulo: task.task_name,
            concluida: task.is_completed,
            subtarefas: subtasksData.map(st => ({
              id: st.id,
              titulo: st.subtask_name,
              concluida: st.is_completed
            }))
          }
        })
      )
      
      setTarefas(tarefasComSubtarefas)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularProgresso = () => {
    if (tarefas.length === 0) return 0
    
    let totalTarefas = 0
    let tarefasConcluidas = 0

    tarefas.forEach(tarefa => {
      if (tarefa.subtarefas && tarefa.subtarefas.length > 0) {
        totalTarefas += tarefa.subtarefas.length
        tarefasConcluidas += tarefa.subtarefas.filter(st => st.concluida).length
      } else {
        totalTarefas += 1
        if (tarefa.concluida) tarefasConcluidas += 1
      }
    })

    return totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0
  }

  const toggleTarefa = async (tarefaId) => {
    try {
      const tarefa = tarefas.find(t => t.id === tarefaId)
      const novaConcluida = !tarefa.concluida

      const novasTarefas = tarefas.map(t => {
        if (t.id === tarefaId) {
          if (t.subtarefas && t.subtarefas.length > 0) {
            return {
              ...t,
              concluida: novaConcluida,
              subtarefas: t.subtarefas.map(st => ({ ...st, concluida: novaConcluida }))
            }
          }
          return { ...t, concluida: novaConcluida }
        }
        return t
      })
      setTarefas(novasTarefas)
      dispararAtualizacao()

      await updateTaskStatus(tarefaId, novaConcluida)
      if (tarefa.subtarefas && tarefa.subtarefas.length > 0) {
        await updateAllSubtasksStatus(tarefaId, novaConcluida)
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      alert('Erro ao atualizar tarefa')
      await carregarTarefas()
    }
  }

  const toggleSubtarefa = async (tarefaId, subtarefaId) => {
    try {
      const tarefa = tarefas.find(t => t.id === tarefaId)
      const subtarefa = tarefa.subtarefas.find(st => st.id === subtarefaId)
      const novaConcluida = !subtarefa.concluida

      const novasTarefas = tarefas.map(t => {
        if (t.id === tarefaId) {
          const novasSubtarefas = t.subtarefas.map(st =>
            st.id === subtarefaId ? { ...st, concluida: novaConcluida } : st
          )
          const todasConcluidas = novasSubtarefas.every(st => st.concluida)
          
          return {
            ...t,
            subtarefas: novasSubtarefas,
            concluida: todasConcluidas
          }
        }
        return t
      })
      setTarefas(novasTarefas)
      dispararAtualizacao()

      await updateSubtaskStatus(subtarefaId, novaConcluida)

      const subtarefasAtualizadas = tarefa.subtarefas.map(st =>
        st.id === subtarefaId ? { ...st, concluida: novaConcluida } : st
      )
      const todasConcluidas = subtarefasAtualizadas.every(st => st.concluida)

      if (tarefa.concluida !== todasConcluidas) {
        await updateTaskStatus(tarefaId, todasConcluidas)
      }
    } catch (error) {
      console.error('Erro ao atualizar subtarefa:', error)
      alert('Erro ao atualizar subtarefa')
      await carregarTarefas()
    }
  }

  const adicionarTarefa = async (titulo, tarefaPaiId = null) => {
    try {
      if (tarefaPaiId) {
        const subtarefaCriada = await createSubtask(projetoId, tarefaPaiId, titulo)
        
        const novasTarefas = tarefas.map(t => {
          if (t.id === tarefaPaiId) {
            return {
              ...t,
              subtarefas: [...t.subtarefas, {
                id: subtarefaCriada.id,
                titulo: subtarefaCriada.subtask_name,
                concluida: subtarefaCriada.is_completed
              }]
            }
          }
          return t
        })
        setTarefas(novasTarefas)
      } else {
        const tarefaCriada = await createTask(projetoId, titulo)
        
        setTarefas([...tarefas, {
          id: tarefaCriada.id,
          titulo: tarefaCriada.task_name,
          concluida: tarefaCriada.is_completed,
          subtarefas: []
        }])
      }
      
      dispararAtualizacao()
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
      throw error
    }
  }

  const removerTarefa = async (tarefaId) => {
    try {
      setTarefas(tarefas.filter(t => t.id !== tarefaId))
      dispararAtualizacao()
      await deleteTask(tarefaId)
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
      alert('Erro ao excluir tarefa')
      await carregarTarefas()
    }
  }

  const removerSubtarefa = async (tarefaId, subtarefaId) => {
    try {
      const novasTarefas = tarefas.map(t => {
        if (t.id === tarefaId) {
          const novasSubtarefas = t.subtarefas.filter(st => st.id !== subtarefaId)
          const todasConcluidas = novasSubtarefas.length > 0 
            ? novasSubtarefas.every(st => st.concluida)
            : false
          
          return {
            ...t,
            subtarefas: novasSubtarefas,
            concluida: todasConcluidas
          }
        }
        return t
      })
      setTarefas(novasTarefas)
      dispararAtualizacao()

      await deleteSubtask(subtarefaId)

      const tarefa = tarefas.find(t => t.id === tarefaId)
      const subtarefasRestantes = tarefa.subtarefas.filter(st => st.id !== subtarefaId)
      if (subtarefasRestantes.length > 0) {
        const todasConcluidas = subtarefasRestantes.every(st => st.concluida)
        if (tarefa.concluida !== todasConcluidas) {
          await updateTaskStatus(tarefaId, todasConcluidas)
        }
      }
    } catch (error) {
      console.error('Erro ao excluir subtarefa:', error)
      alert('Erro ao excluir subtarefa')
      await carregarTarefas()
    }
  }

  return {
    tarefas,
    loading,
    progresso: calcularProgresso(),
    toggleTarefa,
    toggleSubtarefa,
    adicionarTarefa,
    removerTarefa,
    removerSubtarefa
  }
}