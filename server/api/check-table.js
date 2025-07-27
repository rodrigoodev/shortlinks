import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
  try {
    // Verificar se a tabela links existe
    const checkTable = await turso.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='links'
    `)
    
    if (checkTable.rows.length === 0) {
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
    
    return {
      success: true,
      tableExists: true,
      structure: tableInfo.rows,
      data: linksData.rows,
      message: 'Tabela links verificada com sucesso!'
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Erro ao verificar tabela links'
    }
  }
}) 