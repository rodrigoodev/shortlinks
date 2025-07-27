import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { slug, password } = body

        if (!slug || !password) {
            return {
                success: false,
                message: 'Slug e senha são obrigatórios'
            }
        }

        const result = await turso.execute({
            sql: "SELECT * FROM profiles WHERE slug = ? AND password = ?",
            args: [slug, password]
        })

        if (result.rows.length > 0) {
            const profile = result.rows[0]
            return {
                success: true,
                message: 'Autenticação realizada com sucesso',
                profile: {
                    id: profile.id,
                    name: profile.name,
                    slug: profile.slug,
                    description: profile.description,
                    image_url: profile.image_url,
                    background_color: profile.background_color
                }
            }
        } else {
            return {
                success: false,
                message: 'Slug ou senha incorretos'
            }
        }
    } catch (error) {
        return {
            success: false,
            message: 'Erro na autenticação',
            error: error.message
        }
    }
}) 