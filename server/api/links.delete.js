import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('🗑️ Deletando link:', body)
    
    if (!body.id) {
      return {
        success: false,
        message: 'ID do link é obrigatório'
      }
    }
    
    // Deletar link
    await turso.execute(`
      DELETE FROM links WHERE id = ?
    `, [body.id])
    
    console.log('✅ Link deletado com sucesso!')
    
    return {
      success: true,
      message: 'Link deletado com sucesso!'
    }
    
  } catch (error) {
    console.error('❌ Erro ao deletar link:', error)
    return {
      success: false,
      error: error.message,
      message: 'Erro ao deletar link'
    }
  }
}) 