export default defineNuxtRouteMiddleware((to) => {
  // Verificar se está tentando acessar rotas do editor
  if (to.path.startsWith('/editor')) {
    // Verificar se está autenticado
    const isAuthenticated = process.client 
      ? localStorage.getItem('editor-auth') === 'true'
      : false;
    
    if (!isAuthenticated) {
      // Redirecionar para login
      return navigateTo('/login');
    }
  }
}); 