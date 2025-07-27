import { turso } from '../helper/turso.js'

export default defineEventHandler(async (event) => {
    try {
        console.log('Verificando estrutura da tabela profiles...')
        
        // Verificar se a tabela existe
        const tableCheck = await turso.execute(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='profiles'
        `)
        
        console.log('Verificação da tabela:', tableCheck)
        
        if (tableCheck.rows.length === 0) {
            // Criar a tabela se não existir
            console.log('Tabela profiles não existe, criando...')
            await turso.execute(`
                CREATE TABLE profiles (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    description TEXT,
                    image_url TEXT,
                    background_color TEXT DEFAULT '#ffffff',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    slug TEXT
                )
            `)
            
            // Inserir um profile padrão
            await turso.execute(`
                INSERT INTO profiles (id, name, description, image_url, background_color, slug)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                1,
                'Dois Corações',
                'Laços mais felizes',
                'https://i.ibb.co/zV7mdNFk/465034934-558998119945444-7555027977606437789-n.jpg',
                '#f00',
                'dois-coracoes'
            ])
            
            return {
                message: 'Tabela profiles criada com sucesso',
                action: 'created'
            }
        }
        
        // Se a tabela existe, mostrar sua estrutura
        const structure = await turso.execute("PRAGMA table_info(profiles)")
        const data = await turso.execute("SELECT * FROM profiles")
        
        return {
            message: 'Tabela profiles encontrada',
            action: 'exists',
            structure: structure.rows,
            data: data.rows
        }
        
    } catch (error) {
        console.error('Erro ao verificar tabela:', error)
        return {
            message: 'Erro ao verificar tabela',
            error: error.message,
            action: 'error'
        }
    }
}) 