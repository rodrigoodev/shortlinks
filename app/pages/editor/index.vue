<script setup>
// Buscar dados do profile
const { data: page, error } = await useFetch("/api/hello");
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Editor do ShortLinks
        </h1>
        <p class="text-gray-600">Escolha o que você gostaria de editar</p>
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
      <div v-else-if="page" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Card do Profile -->
        <div
          class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300"
        >
          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">👤</span>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Editar Perfil</h2>
            <p class="text-gray-600 mb-6">
              Configure suas informações pessoais, foto e cores do perfil
            </p>
            <NuxtLink
              to="/editor/profile"
              class="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors duration-200"
            >
              Editar Perfil →
            </NuxtLink>
          </div>
        </div>

        <!-- Card dos Links -->
        <div
          class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300"
        >
          <div class="text-center">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">🔗</span>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              Gerenciar Links
            </h2>
            <p class="text-gray-600 mb-6">
              Crie, edite e organize os links do seu perfil
            </p>
            <NuxtLink
              to="/editor/links"
              class="inline-block px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors duration-200"
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

.lg\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.md\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Responsivo */
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.gap-6 {
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

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
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

.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
