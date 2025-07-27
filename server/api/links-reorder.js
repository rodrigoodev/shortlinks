import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.links || !Array.isArray(body.links)) {
      return {
        success: false,
        message: 'Lista de links é obrigatória'
      }
    }
    
    // Atualizar order_index de todos os links
    for (let i = 0; i < body.links.length; i++) {
      const link = body.links[i]
      await turso.execute(`
        UPDATE links SET order_index = ? WHERE id = ?
      `, [i + 1, link.id])
    }
    
    return {
      success: true,
      message: 'Links reordenados com sucesso!'
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Erro ao reordenar links'
    }
  }
}) 