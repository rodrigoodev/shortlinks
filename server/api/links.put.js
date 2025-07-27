import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('✏️ Atualizando link:', body)
    console.log('🔍 Campos recebidos:', Object.keys(body))
    console.log('🔍 ID:', body.id)
    console.log('🔍 Type:', body.type)
    console.log('🔍 Text link:', body.text_link)
    console.log('🔍 Link URL:', body.link_url)
    console.log('🔍 Is active:', body.is_active)
    console.log('🔍 Order index:', body.order_index)
    
    // Validações básicas
    if (!body.id) {
      return {
        success: false,
        message: 'ID do link é obrigatório'
      }
    }
    
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
    
    // Atualizar link
    await turso.execute(`
      UPDATE links SET
        type = ?,
        image_url = ?,
        text_link = ?,
        link_url = ?,
        order_index = ?,
        is_active = ?,
        background_color = ?,
        border_color = ?
      WHERE id = ?
    `, [
      body.type,
      body.image_url || null,
      body.text_link || null,
      body.link_url,
      body.order_index,
      body.is_active ? 1 : 0,
      body.background_color || null,
      body.border_color || null,
      body.id
    ])
    
    console.log('✅ Link atualizado com sucesso!')
    
    return {
      success: true,
      message: 'Link atualizado com sucesso!'
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar link:', error)
    return {
      success: false,
      error: error.message,
      message: 'Erro ao atualizar link'
    }
  }
}) 