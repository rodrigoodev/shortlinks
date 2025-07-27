import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
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
    
    // Verificar quais profiles existem
    const profiles = await turso.execute(`
      SELECT * FROM profiles
    `)
    
    // Buscar links do profile específico ou todos se não houver profile
    let links;
    if (profiles.rows.length > 0) {
      const profileId = profiles.rows[0].id;
      
      links = await turso.execute(`
        SELECT * FROM links 
        WHERE profile_id = ? 
        ORDER BY order_index ASC
      `, [profileId])
    } else {
      links = await turso.execute(`
        SELECT * FROM links 
        ORDER BY order_index ASC
      `)
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