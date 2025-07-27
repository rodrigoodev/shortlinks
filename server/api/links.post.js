import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validações básicas
    if (!body.type || !body.link_url) {
      return {
        success: false,
        message: 'Tipo e URL são obrigatórios'
      }
    }
    
    if (body.type === 'text' && !body.text_link) {
      return {
        success: false,
        message: 'Texto é obrigatório para links do tipo text'
      }
    }
    
    // Verificar se a tabela existe
    const tableCheck = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='links'
    `)
    
    if (tableCheck.rows.length === 0) {
      return {
        success: false,
        message: 'Tabela links não existe. Crie a tabela primeiro.'
      }
    }
    
    // Buscar o próximo order_index
    const maxOrder = await turso.execute(`
      SELECT MAX(order_index) as max_order FROM links WHERE profile_id = 1
    `)
    
    const nextOrder = (maxOrder.rows[0]?.max_order || 0) + 1
    
    // Preparar dados para inserção
    const insertData = [
      1, // profile_id fixo por enquanto
      body.type,
      body.image_url || null,
      body.text_link || null,
      body.link_url,
      nextOrder,
      body.is_active !== false ? 1 : 0,
      body.background_color || null,
      body.border_color || null
    ]
    
    // Inserir novo link
    const result = await turso.execute(`
      INSERT INTO links (
        profile_id, type, image_url, text_link, link_url, 
        order_index, is_active, background_color, border_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, insertData)
    
    return {
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Link criado com sucesso!'
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      message: 'Erro ao criar link'
    }
  }
}) 