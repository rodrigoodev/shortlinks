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

        // Primeiro, buscar o profile_id pelo slug
        const profileResult = await turso.execute({
            sql: "SELECT id FROM profiles WHERE slug = ?",
            args: [slug]
        })

        if (profileResult.rows.length === 0) {
            return {
                success: false,
                message: 'Perfil não encontrado',
                links: []
            }
        }

        const profileId = profileResult.rows[0].id

        // Buscar links do perfil
        const linksResult = await turso.execute({
            sql: "SELECT * FROM links WHERE profile_id = ? AND is_active = 1 ORDER BY order_index ASC",
            args: [profileId]
        })

        return {
            success: true,
            message: 'Links carregados com sucesso',
            links: linksResult.rows
        }
    } catch (error) {
        return {
            success: false,
            message: 'Erro ao buscar links',
            error: error.message,
            links: []
        }
    }
}) 