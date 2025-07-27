import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
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
    
    return {
      success: true,
      message: 'Link deletado com sucesso!'
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Erro ao deletar link'
    }
  }
}) 