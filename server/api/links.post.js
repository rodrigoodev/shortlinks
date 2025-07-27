import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('📝 Criando novo link:', body)
    console.log('📝 Body completo:', JSON.stringify(body, null, 2))
    
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
      console.log('❌ Tabela links não existe!')
      return {
        success: false,
        message: 'Tabela links não existe. Crie a tabela primeiro.'
      }
    }
    
    // Buscar o próximo order_index
    const maxOrder = await turso.execute(`
      SELECT MAX(order_index) as max_order FROM links WHERE profile_id = 1
    `)
    
    console.log('🔍 Max order encontrado:', maxOrder.rows[0]?.max_order)
    const nextOrder = (maxOrder.rows[0]?.max_order || 0) + 1
    console.log('🔍 Próximo order será:', nextOrder)
    
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
    
    console.log('🔍 Dados para inserção:', insertData)
    
    // Inserir novo link
    const result = await turso.execute(`
      INSERT INTO links (
        profile_id, type, image_url, text_link, link_url, 
        order_index, is_active, background_color, border_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, insertData)
    
    console.log('✅ Link criado com sucesso!')
    console.log('✅ Result:', result)
    console.log('✅ LastInsertRowid:', result.lastInsertRowid)
    
    // Verificar se o link foi realmente inserido
    const verifyLink = await turso.execute(`
      SELECT * FROM links WHERE id = ?
    `, [Number(result.lastInsertRowid)])
    
    console.log('🔍 Link verificado após inserção:', verifyLink.rows[0])
    
    return {
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Link criado com sucesso!'
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar link:', error)
    console.error('❌ Stack trace:', error.stack)
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      message: 'Erro ao criar link'
    }
  }
}) 