export default defineNuxtRouteMiddleware((to, from) => {
  // Verificar se está no cliente
  if (process.client) {
    const authData = localStorage.getItem('authData')
    
    if (!authData) {
      // Se não há dados de autenticação, redirecionar para página inicial
      return navigateTo('/')
    }
    
    try {
      const parsedAuth = JSON.parse(authData)
      const now = Date.now()
      const authAge = now - parsedAuth.timestamp
      
      // Verificar se a sessão não expirou (24 horas)
      if (authAge > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('authData')
        return navigateTo('/')
      }
      
      // Se tem dados válidos, permitir acesso
      return
    } catch (error) {
      // Se há erro ao parsear, remover dados inválidos
      localStorage.removeItem('authData')
      return navigateTo('/')
    }
  }
}) 