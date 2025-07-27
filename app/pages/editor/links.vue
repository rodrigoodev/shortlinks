<script setup>
// Buscar dados do profile para o profile_id
const { data: page } = await useFetch("/api/hello");

// Computed para obter o profile_id
const profileId = computed(() => {
  const id = page.value?.profile?.id || 1;
  console.log("🔍 Profile ID computado:", id);
  return id;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <NuxtLink
            to="/editor"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar ao Editor
          </NuxtLink>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gerenciar Links</h1>
        <p class="text-gray-600">
          Crie, edite e organize os links do seu perfil
        </p>
      </div>

      <!-- Conteúdo Principal -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <LinkManager :profile-id="profileId" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-4 {
  gap: 1rem;
}

/* Espaçamento */
.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

/* Bordas */
.rounded-2xl {
  border-radius: 1rem;
}

.border {
  border-width: 1px;
}

.border-gray-100 {
  border-color: #f3f4f6;
}

/* Cores */
.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-white {
  background-color: #ffffff;
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

/* Sombras */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Hover */
.hover\:text-blue-700:hover {
  color: #1d4ed8;
}

/* Texto */
.text-3xl {
  font-size: 1.875rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}
</style>
