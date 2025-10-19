import { supabase } from './supabase'

// ==================== PROJETOS ====================
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createProject(projeto) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      project_name: projeto.nome,
      lead_name: projeto.cliente,
      dev_name: projeto.desenvolvedor,
      project_status: projeto.status,
      delivery_date: projeto.prazo,
      project_value: projeto.valorProjeto,
      entry_value: projeto.valorEntrada,
      hiring_method: projeto.meioContratacao
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateProject(id, projeto) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      project_name: projeto.nome,
      lead_name: projeto.cliente,
      dev_name: projeto.desenvolvedor,
      project_status: projeto.status,
      delivery_date: projeto.prazo,
      project_value: projeto.valorProjeto,
      entry_value: projeto.valorEntrada,
      hiring_method: projeto.meioContratacao
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ==================== TAREFAS ====================
export async function fetchTasks(projectId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createTask(projectId, taskName) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      project_id: projectId,
      task_name: taskName,
      is_completed: false
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateTaskStatus(taskId, isCompleted) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', taskId)
    .select()
  
  if (error) throw error
  return data
}

export async function deleteTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
  
  if (error) throw error
}

// ==================== SUBTAREFAS ====================
export async function fetchSubtasks(taskId) {
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createSubtask(projectId, taskId, subtaskName) {
  const { data, error } = await supabase
    .from('subtasks')
    .insert([{
      project_id: projectId,
      task_id: taskId,
      subtask_name: subtaskName,
      is_completed: false
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateSubtaskStatus(subtaskId, isCompleted) {
  const { data, error } = await supabase
    .from('subtasks')
    .update({ is_completed: isCompleted })
    .eq('id', subtaskId)
    .select()
  
  if (error) throw error
  return data
}

export async function updateAllSubtasksStatus(taskId, isCompleted) {
  const { data, error } = await supabase
    .from('subtasks')
    .update({ is_completed: isCompleted })
    .eq('task_id', taskId)
    .select()
  
  if (error) throw error
  return data
}

export async function deleteSubtask(subtaskId) {
  const { error } = await supabase
    .from('subtasks')
    .delete()
    .eq('id', subtaskId)
  
  if (error) throw error
}

// ==================== TRANSAÇÕES ====================
export async function fetchTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      projects (
        project_name
      )
    `)
    .order('transaction_date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createTransaction(transacao) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      description: transacao.descricao,
      amount: transacao.valor,
      type: transacao.tipo,
      category: transacao.categoria,
      payment_method: transacao.metodoPagamento,
      transaction_date: transacao.data,
      project_id: transacao.projetoId,
      receipt_url: transacao.comprovanteUrl || null
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ==================== UPLOAD DE COMPROVANTES ====================
export async function uploadComprovante(file, transactionId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${transactionId}-${Date.now()}.${fileExt}`
  const filePath = `comprovantes/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('receipts')
    .getPublicUrl(filePath)

  return publicUrl
}

export async function deleteComprovante(url) {
  try {
    const path = url.split('/receipts/')[1]
    
    const { error } = await supabase.storage
      .from('receipts')
      .remove([path])

    if (error) throw error
  } catch (error) {
    console.error('Erro ao deletar comprovante:', error)
  }
}

// ==================== PORTFÓLIO ====================
export async function fetchPortfolio() {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createPortfolioItem(item) {
  const { data, error } = await supabase
    .from('portfolio')
    .insert([{
      project_name: item.projectName,
      project_description: item.description,
      frameworks: item.frameworks,
      cover_image_url: item.coverImageUrl,
      presentation_pdf_url: item.presentationPdfUrl,
      project_id: item.projectId,
      is_featured: item.isFeatured || false,
      display_order: item.displayOrder || 0
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Erro ao criar item do portfólio:', error)
    throw error
  }
  return data
}

export async function updatePortfolioItem(id, item) {
  const { data, error } = await supabase
    .from('portfolio')
    .update({
      project_name: item.projectName,
      project_description: item.description,
      frameworks: item.frameworks,
      cover_image_url: item.coverImageUrl,
      presentation_pdf_url: item.presentationPdfUrl,
      is_featured: item.isFeatured,
      display_order: item.displayOrder
    })
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Erro ao atualizar item do portfólio:', error)
    throw error
  }
  return data
}

export async function deletePortfolioItem(id) {
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Erro ao deletar item do portfólio:', error)
    throw error
  }
}

// ==================== UPLOAD PORTFOLIO - IMAGENS ====================
export async function uploadPortfolioCover(file, itemId) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `cover-${itemId}-${Date.now()}.${fileExt}`
    const filePath = `covers/${fileName}`

    console.log('📤 Iniciando upload da capa:', filePath)

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError)
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath)

    console.log('✅ Upload concluído:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('❌ Erro ao fazer upload da capa:', error)
    throw error
  }
}

export async function deletePortfolioCover(url) {
  try {
    if (!url) return
    
    const path = url.split('/portfolio/')[1]
    
    if (!path) {
      console.warn('⚠️ Caminho inválido para deletar capa:', url)
      return
    }

    console.log('🗑️ Deletando capa:', path)
    
    const { error } = await supabase.storage
      .from('portfolio')
      .remove([path])

    if (error) {
      console.error('❌ Erro ao deletar capa:', error)
      throw error
    }

    console.log('✅ Capa deletada com sucesso')
  } catch (error) {
    console.error('❌ Erro ao deletar capa do portfólio:', error)
  }
}

// ==================== UPLOAD PORTFOLIO - PDFs ====================
export async function uploadPortfolioPdf(file, itemId) {
  try {
    const fileName = `presentation-${itemId}-${Date.now()}.pdf`
    const filePath = `presentations/${fileName}`

    console.log('📤 Iniciando upload do PDF:', filePath)

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Erro no upload do PDF:', uploadError)
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath)

    console.log('✅ Upload do PDF concluído:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('❌ Erro ao fazer upload do PDF:', error)
    throw error
  }
}

export async function deletePortfolioPdf(url) {
  try {
    if (!url) return
    
    const path = url.split('/portfolio/')[1]
    
    if (!path) {
      console.warn('⚠️ Caminho inválido para deletar PDF:', url)
      return
    }

    console.log('🗑️ Deletando PDF:', path)
    
    const { error } = await supabase.storage
      .from('portfolio')
      .remove([path])

    if (error) {
      console.error('❌ Erro ao deletar PDF:', error)
      throw error
    }

    console.log('✅ PDF deletado com sucesso')
  } catch (error) {
    console.error('❌ Erro ao deletar PDF do portfólio:', error)
  }
}