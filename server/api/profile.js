import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        
        // Validações
        if (!body.slug) {
            return {
                success: false,
                message: 'Instagram é obrigatório'
            }
        }
        
        // Limpar espaços extras do nome (se fornecido)
        const cleanName = body.name ? body.name.trim() : ''
        
        // Validar slug
        const cleanSlug = body.slug.toLowerCase().replace(/[^a-z0-9_]/g, "")
        if (cleanSlug.length < 3) {
            return {
                success: false,
                message: 'Instagram deve ter pelo menos 3 caracteres'
            }
        }
        
        // Verificar se o slug já existe em outro perfil
        const slugCheck = await turso.execute({
            sql: 'SELECT id FROM profiles WHERE slug = ? AND id != ?',
            args: [cleanSlug, body.id]
        })
        
        if (slugCheck.rows.length > 0) {
            return {
                success: false,
                message: 'Este Instagram já está em uso por outro perfil'
            }
        }
        
        // Verificar se o profile existe antes de atualizar
        const checkResult = await turso.execute({
            sql: 'SELECT COUNT(*) as count FROM profiles WHERE id = ?',
            args: [body.id]
        })
        
        if (checkResult.rows[0].count === 0) {
            // Se não existir, criar um novo (não deveria acontecer em edição)
            // Preparar campos para INSERT
            const insertFields = ['id', 'name', 'description', 'image_url', 'background_color', 'slug', 'created_at']
            const insertValues = ['?', '?', '?', '?', '?', '?', 'CURRENT_TIMESTAMP']
            const insertArgs = [
                body.id,
                cleanName,
                body.description || '',
                body.image_url || '',
                body.background_color || '#ffffff',
                cleanSlug
            ]
            
            // Adicionar senha apenas se fornecida
            if (body.password && body.password.trim() !== '') {
                insertFields.push('password')
                insertValues.push('?')
                insertArgs.push(body.password)
            }
            
            await turso.execute({
                sql: `INSERT INTO profiles (${insertFields.join(', ')}) 
                      VALUES (${insertValues.join(', ')})`,
                args: insertArgs
            })
        } else {
            // Se existir, atualizar apenas os campos fornecidos
            const updateFields = []
            const updateArgs = []
            
            if (body.name !== undefined) {
                updateFields.push('name = ?')
                updateArgs.push(cleanName)
            }
            if (body.description !== undefined) {
                updateFields.push('description = ?')
                updateArgs.push(body.description)
            }
            if (body.image_url !== undefined) {
                updateFields.push('image_url = ?')
                updateArgs.push(body.image_url)
            }
            if (body.background_color !== undefined) {
                updateFields.push('background_color = ?')
                updateArgs.push(body.background_color)
            }
            if (body.slug !== undefined) {
                updateFields.push('slug = ?')
                updateArgs.push(cleanSlug)
            }
            if (body.password !== undefined && body.password.trim() !== '') {
                updateFields.push('password = ?')
                updateArgs.push(body.password)
            }
            
            // Adicionar o ID no final
            updateArgs.push(body.id)
            
            const result = await turso.execute({
                sql: `UPDATE profiles SET ${updateFields.join(', ')} WHERE id = ?`,
                args: updateArgs
            })
        }
        return {
            message: 'Profile atualizado com sucesso',
            success: true,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        return {
            message: 'Erro ao atualizar profile',
            error: error.message,
            success: false
        }
    }
}) 