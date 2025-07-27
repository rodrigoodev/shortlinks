import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        const result = await turso.execute("SELECT * FROM profiles LIMIT 1")
        console.log('Dados do Turso:', result)

        if (result.rows.length > 0) {
            return {
                message: 'Dados carregados com sucesso',
                profile: result.rows[0]
            }
        } else {
            return {
                message: 'Nenhum profile encontrado',
                profile: null
            }
        }
    } catch (error) {
        console.error('Erro ao conectar com Turso:', error)
        return {
            message: 'Erro ao conectar com banco de dados',
            error: error.message
        }
    }
}) 