<script setup>
// Estado do formulário
const password = ref("");
const error = ref("");
const loading = ref(false);

// Função de login
const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Simular delay para melhor UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verificar senha
    if (password.value === "tailaine123") {
      // Salvar no localStorage para manter sessão
      localStorage.setItem("editor-auth", "true");

      // Redirecionar para o editor
      await navigateTo("/editor");
    } else {
      error.value = "Senha incorreta";
    }
  } catch (err) {
    error.value = "Erro ao fazer login";
  } finally {
    loading.value = false;
  }
};

// Verificar se já está logado
onMounted(() => {
  const isAuthenticated = localStorage.getItem("editor-auth") === "true";
  if (isAuthenticated) {
    navigateTo("/editor");
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="w-full max-w-md">
      <!-- Card de Login -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-2xl">🔐</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Acesso ao Editor</h1>
          <p class="text-gray-600 mt-2">
            Digite a senha para acessar o painel administrativo
          </p>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo de Senha -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Digite a senha"
              class="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              :disabled="loading"
            />
          </div>

          <!-- Mensagem de Erro -->
          <div
            v-if="error"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Botão de Login -->
          <button
            type="submit"
            :disabled="loading || !password"
            class="w-full p-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
              ></div>
              Entrando...
            </span>
            <span v-else>Entrar no Editor</span>
          </button>
        </form>

        <!-- Link para voltar -->
        <div class="text-center mt-6">
          <NuxtLink
            to="/"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ← Voltar para o perfil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animações */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transições */
.transition-colors {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Layout */
.min-h-screen {
  min-height: 100vh;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

/* Tamanhos */
.max-w-md {
  max-width: 28rem;
}

.w-full {
  width: 100%;
}

.w-16 {
  width: 4rem;
}

.h-16 {
  height: 4rem;
}

.h-5 {
  height: 1.25rem;
}

.w-5 {
  width: 1.25rem;
}

/* Bordas */
.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-2xl {
  border-radius: 1rem;
}

.rounded-full {
  border-radius: 9999px;
}

.border {
  border-width: 1px;
}

.border-b-2 {
  border-bottom-width: 2px;
}

/* Cores */
.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-white {
  background-color: #ffffff;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-red-50 {
  background-color: #fef2f2;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.border-red-200 {
  border-color: #fecaca;
}

.text-gray-900 {
  color: #111827;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

.text-blue-600 {
  color: #2563eb;
}

.text-red-600 {
  color: #dc2626;
}

.text-white {
  color: #ffffff;
}

/* Sombras */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Padding e Margin */
.p-4 {
  padding: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-8 {
  padding: 2rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Espaçamento */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Texto */
.text-2xl {
  font-size: 1.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

/* Focus */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:border-transparent:focus {
  border-color: transparent;
}

/* Hover */
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:text-blue-700:hover {
  color: #1d4ed8;
}

/* Disabled */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Display */
.block {
  display: block;
}
</style>
