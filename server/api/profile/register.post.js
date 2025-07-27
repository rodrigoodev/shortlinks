import { turso } from '../../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { name, slug, password, email, description } = body
        


        // Validações
        if (!name || !slug || !password) {
            return {
                success: false,
                message: 'Nome, Instagram e senha são obrigatórios'
            }
        }

        // Verificar se o slug já existe
        const checkResult = await turso.execute({
            sql: 'SELECT COUNT(*) as count FROM profiles WHERE slug = ?',
            args: [slug]
        })

        if (checkResult.rows[0].count > 0) {
            return {
                success: false,
                message: 'Este Instagram já está em uso'
            }
        }

        // Gerar ID único
        const idResult = await turso.execute({
            sql: 'SELECT MAX(id) as maxId FROM profiles'
        })
        const newId = (idResult.rows[0].maxId || 0) + 1

        // Inserir novo perfil
        await turso.execute({
            sql: `INSERT INTO profiles (id, name, description, image_url, background_color, slug, password, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            args: [
                newId,
                name,
                description || '',
                '', // image_url vazio por padrão
                '#ffffff', // background_color padrão
                slug,
                password
            ]
        })

        return {
            success: true,
            message: 'Perfil criado com sucesso!',
            profile: {
                id: newId,
                name,
                slug,
                description: description || ''
            }
        }
    } catch (error) {
        console.error('Erro ao criar perfil:', error)
        return {
            success: false,
            message: 'Erro ao criar perfil. Tente novamente.',
            error: error.message
        }
    }
}) 