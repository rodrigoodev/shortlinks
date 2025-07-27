<script setup>
// Buscar dados do profile
const { data: profileData, error } = await useFetch("/api/hello");

// Computed para acessar os dados do profile
const profile = computed(() => profileData.value?.profile || null);

// Função para calcular cor de texto baseada na cor de fundo
const getContrastColor = (hexColor) => {
  if (!hexColor) return "#000000";

  // Remove # se presente
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#ffffff";
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-300"
    :style="{
      backgroundColor: profile?.background_color || '#ffffff',
      color: getContrastColor(profile?.background_color || '#ffffff'),
    }"
  >
    <!-- Loading State -->
    <div v-if="!profile && !error" class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"
      ></div>
      <p>Carregando perfil...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center">
      <div class="text-red-500 mb-4">
        <svg
          class="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold mb-2">Erro ao carregar perfil</h2>
      <p class="text-sm opacity-80">{{ error.message }}</p>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile" class="w-full max-w-md text-center">
      <!-- Avatar -->
      <div v-if="profile.image_url" class="mb-6">
        <img
          :src="profile.image_url"
          :alt="profile.name"
          class="w-24 h-24 rounded-full mx-auto object-cover border-4 shadow-lg"
          :style="{ borderColor: getContrastColor(profile.background_color) }"
        />
      </div>

      <!-- Profile Info -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">{{ profile.name }}</h1>

        <p v-if="profile.description" class="text-lg opacity-90 mb-4">
          {{ profile.description }}
        </p>

        <div v-if="profile.slug" class="text-sm opacity-70">
          @{{ profile.slug }}
        </div>
      </div>

      <!-- Links Section (Placeholder) -->
      <div class="space-y-3">
        <div class="bg-black bg-opacity-10 rounded-xl p-4 text-center">
          <p class="font-medium">Links em breve...</p>
          <p class="text-sm opacity-70 mt-1">
            Aqui serão exibidos os links do perfil
          </p>
        </div>

        <!-- Example Link -->
        <a
          href="/editor"
          class="block w-full p-4 rounded-xl text-center font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg bg-black bg-opacity-10 hover:bg-opacity-20"
        >
          ✏️ Editar Perfil
        </a>
      </div>

      <!-- Footer -->
      <div class="mt-12 text-center opacity-60">
        <p class="text-sm">Powered by ShortLinks</p>
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

.duration-300 {
  transition-duration: 300ms;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:bg-opacity-20:hover {
  --tw-bg-opacity: 0.2;
}

/* Opacidade */
.opacity-60 {
  opacity: 0.6;
}

.opacity-70 {
  opacity: 0.7;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-90 {
  opacity: 0.9;
}

/* Espaçamento */
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

/* Tamanhos */
.max-w-md {
  max-width: 28rem;
}

.w-24 {
  width: 6rem;
}

.h-24 {
  height: 6rem;
}

.w-12 {
  width: 3rem;
}

.h-12 {
  height: 3rem;
}

/* Bordas */
.rounded-full {
  border-radius: 9999px;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.border-4 {
  border-width: 4px;
}

/* Sombras */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Background opacity */
.bg-opacity-10 {
  --tw-bg-opacity: 0.1;
}

/* Texto */
.text-2xl {
  font-size: 1.5rem;
}

.text-lg {
  font-size: 1.125rem;
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

.font-semibold {
  font-weight: 600;
}

/* Cores */
.text-red-500 {
  color: #ef4444;
}

/* Layout */
.min-h-screen {
  min-height: 100vh;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
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

.block {
  display: block;
}

.w-full {
  width: 100%;
}

/* Padding e Margin */
.p-4 {
  padding: 1rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
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

.mt-1 {
  margin-top: 0.25rem;
}

.mt-12 {
  margin-top: 3rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
