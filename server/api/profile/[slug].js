import { turso } from '../../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        const slug = getRouterParam(event, 'slug')
        
        if (!slug) {
            return {
                success: false,
                message: 'Slug não fornecido'
            }
        }

        const result = await turso.execute({
            sql: "SELECT * FROM profiles WHERE slug = ?",
            args: [slug]
        })

        if (result.rows.length > 0) {
            return {
                success: true,
                message: 'Perfil encontrado',
                profile: result.rows[0]
            }
        } else {
            return {
                success: false,
                message: 'Perfil não encontrado',
                profile: null
            }
        }
    } catch (error) {
        return {
            success: false,
            message: 'Erro ao buscar perfil',
            error: error.message
        }
    }
}) 