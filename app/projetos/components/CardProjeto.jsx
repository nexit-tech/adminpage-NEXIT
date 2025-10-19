'use client'
import { useState, useEffect } from 'react'
import { Calendar, User, Edit2, Trash2, DollarSign, Briefcase, CheckSquare, Code } from 'lucide-react'
import './CardProjeto.css'
import { fetchTasks, fetchSubtasks } from '@/lib/supabaseQueries'
import { useProjetosContext } from '../ProjetosContext'

export default function CardProjeto({ projeto, onEditar, onExcluir, onTarefas }) {
  const [progresso, setProgresso] = useState(0)
  const [loading, setLoading] = useState(true)
  const { atualizarTrigger } = useProjetosContext()

  // Recalcular quando o trigger mudar
  useEffect(() => {
    calcularProgresso()
  }, [atualizarTrigger]) // Reage a mudanças no trigger

  const calcularProgresso = async () => {
    setLoading(true)
    try {
      const tasksData = await fetchTasks(projeto.id)
      
      if (tasksData.length === 0) {
        setProgresso(0)
        setLoading(false)
        return
      }

      let totalTarefas = 0
      let tarefasConcluidas = 0

      for (const task of tasksData) {
        const subtasksData = await fetchSubtasks(task.id)
        
        if (subtasksData.length > 0) {
          totalTarefas += subtasksData.length
          tarefasConcluidas += subtasksData.filter(st => st.is_completed).length
        } else {
          totalTarefas += 1
          if (task.is_completed) tarefasConcluidas += 1
        }
      }

      const percentual = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0
      setProgresso(percentual)
    } catch (error) {
      console.error('Erro ao calcular progresso:', error)
      setProgresso(0)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'Em Andamento': return 'status-andamento'
      case 'Planejamento': return 'status-planejamento'
      case 'Concluído': return 'status-concluido'
      default: return ''
    }
  }

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  return (
    <div className="card-projeto">
      <div className="card-header">
        <h3>{projeto.nome}</h3>
        <span className={`status-badge ${getStatusClass(projeto.status)}`}>
          {projeto.status}
        </span>
      </div>

      {!loading && progresso > 0 && (
        <div className="card-progresso">
          <div className="progresso-info">
            <span className="progresso-label">Progresso</span>
            <span className="progresso-valor">{progresso}%</span>
          </div>
          <div className="progresso-barra">
            <div 
              className="progresso-preenchimento" 
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="card-body">
        <div className="card-info">
          <User size={16} />
          <span>{projeto.cliente}</span>
        </div>
        <div className="card-info">
          <Code size={16} />
          <span>{projeto.desenvolvedor}</span>
        </div>
        <div className="card-info">
          <Calendar size={16} />
          <span>{new Date(projeto.prazo).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="card-info">
          <DollarSign size={16} />
          <span>{formatarValor(projeto.valorProjeto)}</span>
        </div>
        <div className="card-info">
          <Briefcase size={16} />
          <span>{projeto.meioContratacao}</span>
        </div>
      </div>
      
      <div className="card-footer">
        <button className="btn-action btn-tarefas" onClick={onTarefas}>
          <CheckSquare size={16} />
          <span>Tarefas</span>
        </button>
      </div>

      <div className="card-footer-actions">
        <button className="btn-action btn-editar" onClick={onEditar}>
          <Edit2 size={16} />
          <span>Editar</span>
        </button>
        <button className="btn-action btn-deletar" onClick={onExcluir}>
          <Trash2 size={16} />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  )
}