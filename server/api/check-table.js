import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        // Verificar se a tabela profiles existe
        const tableCheck = await turso.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='profiles'"
        })

        if (tableCheck.rows.length === 0) {
            return {
                success: false,
                message: 'Tabela profiles não existe'
            }
        }

        // Obter informações sobre as colunas da tabela
        const columnsInfo = await turso.execute({
            sql: "PRAGMA table_info(profiles)"
        })

        // Contar registros
        const countResult = await turso.execute({
            sql: "SELECT COUNT(*) as count FROM profiles"
        })

        return {
            success: true,
            message: 'Tabela profiles existe',
            tableInfo: {
                columns: columnsInfo.rows,
                totalRecords: countResult.rows[0].count
            }
        }
    } catch (error) {
        return {
            success: false,
            message: 'Erro ao verificar tabela',
            error: error.message
        }
    }
}) 