import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 Verificando estrutura da tabela links...')
    
    // Verificar se a tabela links existe
    const checkTable = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='links'
    `)
    
    console.log('🔍 Tabela links existe?', checkTable.rows.length > 0)
    
    if (checkTable.rows.length === 0) {
      console.log('❌ Tabela links não existe!')
      return {
        success: false,
        tableExists: false,
        message: 'Tabela links não existe. Crie a tabela manualmente.'
      }
    }
    
    // Buscar estrutura da tabela
    const tableInfo = await turso.execute(`
      PRAGMA table_info(links)
    `)
    
    // Buscar dados da tabela
    const linksData = await turso.execute(`
      SELECT * FROM links ORDER BY order_index
    `)
    
    console.log('✅ Estrutura da tabela:', tableInfo.rows)
    console.log('✅ Dados da tabela:', linksData.rows)
    
    return {
      success: true,
      tableExists: true,
      structure: tableInfo.rows,
      data: linksData.rows,
      message: 'Tabela links verificada com sucesso!'
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabela links:', error)
    return {
      success: false,
      error: error.message,
      message: 'Erro ao verificar tabela links'
    }
  }
}) 