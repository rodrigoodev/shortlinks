export default defineEventHandler(async (event) => {
  return {
    success: true,
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  }
}) 