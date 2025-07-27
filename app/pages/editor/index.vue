<script setup>
// Middleware de autenticação
definePageMeta({
  middleware: ["auth"],
});

// Buscar dados do profile
const { data: page, error } = await useFetch("/api/hello");

// Função de logout
const logout = () => {
  localStorage.removeItem("editor-auth");
  navigateTo("/");
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8"
      >
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Editor do ShortLinks
          </h1>
          <p class="text-gray-600 text-sm sm:text-base">
            Escolha o que você gostaria de editar
          </p>
        </div>
        <button
          @click="logout"
          class="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm text-sm sm:text-base"
          title="Sair do editor"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          Sair
        </button>
      </div>

      <!-- Loading -->
      <div v-if="!page && !error" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p>Carregando dados...</p>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <h3 class="text-red-800 font-medium">Erro ao carregar dados</h3>
        <p class="text-red-600 text-sm">{{ error.message }}</p>
      </div>

      <!-- Conteúdo Principal -->
      <div v-else-if="page" class="editor-grid">
        <!-- Card do Profile -->
        <div class="editor-card">
          <div class="text-center">
            <div class="editor-icon">
              <span>👤</span>
            </div>
            <h2 class="editor-title">Editar Perfil</h2>
            <p class="editor-description">
              Configure suas informações pessoais, foto e cores do perfil
            </p>
            <NuxtLink
              to="/editor/profile"
              class="editor-button editor-button-blue"
            >
              Editar Perfil →
            </NuxtLink>
          </div>
        </div>

        <!-- Card dos Links -->
        <div class="editor-card">
          <div class="text-center">
            <div class="editor-icon editor-icon-green">
              <span>🔗</span>
            </div>
            <h2 class="editor-title">Gerenciar Links</h2>
            <p class="editor-description">
              Crie, edite e organize os links do seu perfil
            </p>
            <NuxtLink
              to="/editor/links"
              class="editor-button editor-button-green"
            >
              Gerenciar Links →
            </NuxtLink>
          </div>
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
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
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

.justify-between {
  justify-content: space-between;
}

.sm\:gap-0 {
  gap: 0;
}

.gap-2 {
  gap: 0.5rem;
}

.w-4 {
  width: 1rem;
}

.w-12 {
  width: 3rem;
}

.h-12 {
  height: 3rem;
}

.sm\:w-16 {
  width: 4rem;
}

.md\:w-16 {
  width: 4rem;
}

.md\:h-16 {
  height: 4rem;
}

.sm\:h-16 {
  height: 4rem;
}

.h-4 {
  height: 1rem;
}

.max-w-4xl {
  max-width: 56rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.sm\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.lg\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.sm\:px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.md\:px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.sm\:py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.md\:py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.md\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Layout do Editor */
.editor-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.editor-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  padding: 1rem;
  transition: box-shadow 0.3s ease;
}

.editor-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Desktop - duas colunas */
@media (min-width: 768px) {
  .editor-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .editor-card {
    padding: 1.5rem;
  }
}

/* Elementos dos cards */
.editor-icon {
  width: 3rem;
  height: 3rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.25rem;
}

.editor-icon-green {
  background-color: #dcfce7;
}

.editor-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.editor-description {
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.editor-button {
  display: inline-block;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.editor-button:hover {
  background-color: #1d4ed8;
}

.editor-button-green {
  background-color: #16a34a;
}

.editor-button-green:hover {
  background-color: #15803d;
}

/* Desktop - ajustes */
@media (min-width: 768px) {
  .editor-icon {
    width: 4rem;
    height: 4rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .editor-title {
    font-size: 1.25rem;
  }

  .editor-description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .editor-button {
    width: auto;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

.gap-6 {
  gap: 1.5rem;
}

.sm\:gap-6 {
  gap: 1.5rem;
}

.gap-8 {
  gap: 2rem;
}

/* Espaçamento */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.sm\:mb-4 {
  margin-bottom: 1rem;
}

.md\:mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.sm\:mb-6 {
  margin-bottom: 1.5rem;
}

.md\:mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.sm\:mb-8 {
  margin-bottom: 2rem;
}

.p-4 {
  padding: 1rem;
}

.sm\:p-6 {
  padding: 1.5rem;
}

.md\:p-6 {
  padding: 1.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.p-6 {
  padding: 1.5rem;
}

.sm\:p-8 {
  padding: 2rem;
}

.p-8 {
  padding: 2rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

/* Tamanhos */
.w-full {
  width: 100%;
}

.sm\:w-auto {
  width: auto;
}

.md\:w-auto {
  width: auto;
}

.w-16 {
  width: 4rem;
}

.h-12 {
  height: 3rem;
}

.h-16 {
  height: 4rem;
}

/* Bordas */
.rounded-2xl {
  border-radius: 1rem;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.border {
  border-width: 1px;
}

.border-gray-100 {
  border-color: #f3f4f6;
}

/* Cores */
.bg-white {
  background-color: #ffffff;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.bg-green-600 {
  background-color: #16a34a;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-white {
  color: #ffffff;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-xl {
  font-size: 1.25rem;
}

.sm\:text-2xl {
  font-size: 1.5rem;
}

.md\:text-2xl {
  font-size: 1.5rem;
}

.md\:text-xl {
  font-size: 1.25rem;
}

.sm\:text-3xl {
  font-size: 1.875rem;
}

/* Sombras */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Hover */
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-green-700:hover {
  background-color: #15803d;
}

.hover\:bg-red-700:hover {
  background-color: #b91c1c;
}

.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Transições */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Display */
.inline-block {
  display: inline-block;
}

/* Flexbox */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

/* Bordas */
.rounded-lg {
  border-radius: 0.5rem;
}

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

.border-gray-100 {
  border-color: #f3f4f6;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.border-red-200 {
  border-color: #fecaca;
}

/* Cores */
.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-white {
  background-color: #ffffff;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-red-50 {
  background-color: #fef2f2;
}

.bg-red-600 {
  background-color: #dc2626;
}

.bg-gray-600 {
  background-color: #8ea1bb;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-900 {
  color: #111827;
}

.text-blue-600 {
  color: #2563eb;
}

.text-red-600 {
  color: #dc2626;
}

.text-red-800 {
  color: #991b1b;
}

.text-white {
  color: #ffffff;
}

/* Sombras */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Focus */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: #3b82f6;
}

.focus\:border-transparent:focus {
  border-color: transparent;
}

/* Hover */
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-gray-700:hover {
  background-color: #374151;
}

/* Disabled */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

/* Texto */
.text-3xl {
  font-size: 1.875rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-sm {
  font-size: 0.875rem;
}

.sm\:text-base {
  font-size: 1rem;
}

.md\:text-base {
  font-size: 1rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

/* Texto centralizado */
.text-center {
  text-align: center;
}

/* Overflow */
.overflow-auto {
  overflow: auto;
}

/* Responsividade */
@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
