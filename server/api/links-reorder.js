import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('🔄 Reordenando links:', body)
    
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
    
    console.log('✅ Links reordenados com sucesso!')
    
    return {
      success: true,
      message: 'Links reordenados com sucesso!'
    }
    
  } catch (error) {
    console.error('❌ Erro ao reordenar links:', error)
    return {
      success: false,
      error: error.message,
      message: 'Erro ao reordenar links'
    }
  }
}) 