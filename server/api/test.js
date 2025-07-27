export default defineEventHandler(async (event) => {
  console.log('🧪 API de teste chamada!')
  
  return {
    success: true,
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  }
}) 