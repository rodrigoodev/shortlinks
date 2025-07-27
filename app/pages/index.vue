<script setup>
// Buscar dados do profile
const { data: profileData, error } = await useFetch("/api/hello");

// Buscar links do profile
const { data: linksData, error: linksError } = await useFetch("/api/links");
console.log("🔍 Links na página principal:", linksData.value);
console.log("🔍 Erro dos links na página principal:", linksError.value);

// Computed para acessar os dados do profile
const profile = computed(() => profileData.value?.profile || null);

// Computed para acessar os links
const links = computed(() => linksData.value?.links || []);

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

      <!-- Links Section -->
      <div class="space-y-3">
        <!-- Links Ativos -->
        <div v-if="links.length > 0" class="space-y-3">
          <a
            v-for="link in links.filter(
              (l) => l.is_active === 1 || l.is_active === true
            )"
            :key="link.id"
            :href="link.link_url"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full rounded-xl text-center font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            :style="{
              backgroundColor:
                link.background_color || 'rgba(255, 255, 255, 0.1)',
              borderColor: link.border_color || 'transparent',
              borderWidth: link.border_color ? '2px' : '0',
              borderStyle: 'solid',
            }"
          >
            <!-- Link do tipo text -->
            <div
              v-if="link.type === 'text'"
              class="flex items-center justify-center gap-4 p-4"
            >
              <div
                v-if="link.image_url"
                class="w-5 h-5 rounded overflow-hidden flex-shrink-0"
              >
                <img
                  :src="link.image_url"
                  :alt="link.text_link"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display = 'none'"
                />
              </div>
              <span
                class="font-medium flex-1 text-left"
                :style="{
                  color: getContrastColor(
                    link.background_color ||
                      profile?.background_color ||
                      '#ffffff'
                  ),
                }"
                >{{ link.text_link }}</span
              >
            </div>

            <!-- Link do tipo image -->
            <div v-else-if="link.type === 'image'" class="p-3">
              <div class="w-full h-24 rounded-lg overflow-hidden">
                <img
                  v-if="link.image_url"
                  :src="link.image_url"
                  :alt="link.text_link || 'Link'"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display = 'none'"
                />
                <div
                  v-else
                  class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  Imagem
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- Mensagem quando não há links -->
        <div v-else class="bg-black bg-opacity-10 rounded-xl p-4 text-center">
          <p class="font-medium">Nenhum link cadastrado</p>
          <p class="text-sm opacity-70 mt-1">Adicione links no editor</p>

          <!-- Debug: Mostrar todos os links -->
          <div
            v-if="links.length > 0"
            class="mt-4 p-3 bg-gray-100 rounded text-left"
          >
            <p class="text-xs font-medium mb-2">Debug - Todos os links:</p>
            <div v-for="link in links" :key="link.id" class="text-xs mb-1">
              ID: {{ link.id }} | Tipo: {{ link.type }} | Ativo:
              {{ link.is_active }} | Texto: {{ link.text_link }}
            </div>
          </div>
        </div>

        <!-- Link para o Editor -->
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

/* Gap */
.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

/* Flex utilities */
.flex-shrink-0 {
  flex-shrink: 0;
}

.flex-1 {
  flex: 1 1 0%;
}

/* Overflow */
.overflow-hidden {
  overflow: hidden;
}

/* Object fit */
.object-cover {
  object-fit: cover;
}

/* Target blank */
.target-blank {
  target: _blank;
}

/* Links sem decoração */
a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}

/* Espaçamento */
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

/* Tamanhos */
.max-w-md {
  max-width: 28rem;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

.h-24 {
  height: 6rem;
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

.text-gray-500 {
  color: #6b7280;
}

.bg-gray-200 {
  background-color: #e5e7eb;
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

.text-left {
  text-align: left;
}

.block {
  display: block;
}

.w-full {
  width: 100%;
}

/* Padding e Margin */
.p-3 {
  padding: 0.75rem;
}

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
