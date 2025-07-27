import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    // Obter o profile_id da query string
    const query = getQuery(event)
    const profileId = query.profile_id || query.profileId
    
    // Verificar se a tabela existe
    const tableCheck = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='links'
    `)
    
    if (tableCheck.rows.length === 0) {
      return {
        success: false,
        links: [],
        message: 'Tabela links não existe'
      }
    }
    
    // Buscar links do profile específico
    let links;
    if (profileId) {
      links = await turso.execute(`
        SELECT * FROM links 
        WHERE profile_id = ? 
        ORDER BY order_index ASC
      `, [profileId])
    } else {
      // Se não há profile_id, retornar erro
      return {
        success: false,
        links: [],
        message: 'Profile ID é obrigatório'
      }
    }
    
    const response = {
      success: true,
      links: links.rows,
      message: 'Links carregados com sucesso!'
    }
    
    return response
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Erro ao carregar links'
    }
  }
}) 