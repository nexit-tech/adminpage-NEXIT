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
    .single()

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

export async function fetchSubtasks(taskId) {
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', taskId)
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

export async function updateTaskStatus(taskId, isCompleted) {
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', taskId)

  if (error) throw error
}

export async function updateSubtaskStatus(subtaskId, isCompleted) {
  const { error } = await supabase
    .from('subtasks')
    .update({ is_completed: isCompleted })
    .eq('id', subtaskId)

  if (error) throw error
}

export async function updateAllSubtasksStatus(taskId, isCompleted) {
  const { error } = await supabase
    .from('subtasks')
    .update({ is_completed: isCompleted })
    .eq('task_id', taskId)

  if (error) throw error
}

export async function deleteTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
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
      receipt_url: transacao.comprovanteUrl
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

export async function uploadComprovante(file, transactionId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${transactionId}_${Date.now()}.${fileExt}`
  const filePath = `comprovantes/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('comprovantes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('comprovantes')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// ==================== PORTFÓLIO ====================

export async function fetchPortfolio() {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('is_featured', { ascending: false })
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

  if (error) throw error
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
    .single()

  if (error) throw error
  return data
}

export async function deletePortfolioItem(id) {
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Upload de imagem de capa
export async function uploadPortfolioCover(file, portfolioId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${portfolioId}_${Date.now()}.${fileExt}`
  const filePath = `covers/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Upload de PDF de apresentação
export async function uploadPortfolioPdf(file, portfolioId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${portfolioId}_${Date.now()}.${fileExt}`
  const filePath = `presentations/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('portfolio-pdfs')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('portfolio-pdfs')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Deletar imagem de capa
export async function deletePortfolioCover(url) {
  const path = url.split('/portfolio-images/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('portfolio-images')
    .remove([path])

  if (error) console.error('Erro ao deletar imagem:', error)
}

// Deletar PDF
export async function deletePortfolioPdf(url) {
  const path = url.split('/portfolio-pdfs/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('portfolio-pdfs')
    .remove([path])

  if (error) console.error('Erro ao deletar PDF:', error)
}