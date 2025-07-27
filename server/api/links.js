import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔗 API /api/links chamada!')
    console.log('🔗 Método:', event.method)
    console.log('🔗 URL:', event.path)
    console.log('🔗 Buscando links do perfil...')
    
    // Verificar se a tabela existe
    const tableCheck = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='links'
    `)
    
    console.log('🔍 Tabela links existe?', tableCheck.rows.length > 0)
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Tabela links não existe!')
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
    
    console.log('🔍 Profiles existentes:', profiles.rows)
    
    // Primeiro, verificar todos os links na tabela
    const allLinks = await turso.execute(`
      SELECT * FROM links ORDER BY order_index ASC
    `)
    
    console.log('🔍 Todos os links na tabela:', allLinks.rows.length)
    console.log('🔍 Dados de todos os links:', JSON.stringify(allLinks.rows, null, 2))
    
    // Buscar links do profile específico ou todos se não houver profile
    let links;
    if (profiles.rows.length > 0) {
      const profileId = profiles.rows[0].id;
      console.log('🔍 Usando profile_id:', profileId)
      
      links = await turso.execute(`
        SELECT * FROM links 
        WHERE profile_id = ? 
        ORDER BY order_index ASC
      `, [profileId])
    } else {
      console.log('🔍 Nenhum profile encontrado, buscando todos os links')
      links = await turso.execute(`
        SELECT * FROM links 
        ORDER BY order_index ASC
      `)
    }
    
    console.log('✅ Links encontrados:', links.rows.length)
    console.log('✅ Dados dos links:', JSON.stringify(links.rows, null, 2))
    
    // Verificar se há links e seus valores
    if (links.rows.length > 0) {
      console.log('🔍 Primeiro link:', links.rows[0])
      console.log('🔍 is_active do primeiro link:', links.rows[0].is_active, typeof links.rows[0].is_active)
    }
    
    const response = {
      success: true,
      links: links.rows,
      message: 'Links carregados com sucesso!'
    }
    
    console.log('✅ Resposta da API:', response)
    return response
    
  } catch (error) {
    console.error('❌ Erro ao buscar links:', error)
    return {
      success: false,
      error: error.message,
      message: 'Erro ao carregar links'
    }
  }
}) 