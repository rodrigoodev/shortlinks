import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        console.log('API Profile PUT - Iniciando...')
        const body = await readBody(event)
        console.log('Dados recebidos:', body)
        
        // Verificar se o profile existe antes de atualizar
        const checkResult = await turso.execute({
            sql: 'SELECT COUNT(*) as count FROM profiles WHERE id = ?',
            args: [body.id || 1]
        })
        
        console.log('Verificação de profile:', checkResult)
        
        if (checkResult.rows[0].count === 0) {
            // Se não existir, criar um novo
            console.log('Profile não encontrado, criando novo...')
            await turso.execute({
                sql: `INSERT INTO profiles (id, name, description, image_url, background_color, slug, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                args: [
                    body.id || 1,
                    body.name || '',
                    body.description || '',
                    body.image_url || '',
                    body.background_color || '#ffffff',
                    body.slug || ''
                ]
            })
        } else {
            // Se existir, atualizar
            console.log('Profile encontrado, atualizando...')
            const result = await turso.execute({
                sql: `UPDATE profiles 
                      SET name = ?, description = ?, image_url = ?, background_color = ?, slug = ?
                      WHERE id = ?`,
                args: [
                    body.name || '',
                    body.description || '',
                    body.image_url || '',
                    body.background_color || '#ffffff',
                    body.slug || '',
                    body.id || 1
                ]
            })
            console.log('Resultado da atualização:', result)
        }

        console.log('Operação concluída com sucesso')
        return {
            message: 'Profile atualizado com sucesso',
            success: true,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error('Erro ao atualizar profile:', error)
        return {
            message: 'Erro ao atualizar profile',
            error: error.message,
            success: false
        }
    }
}) 