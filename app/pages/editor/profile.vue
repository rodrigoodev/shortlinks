<script setup>
// Middleware de autenticação
definePageMeta({
  middleware: ["auth"],
});

// Obter dados do perfil autenticado
const authData = ref(null);
const profile = ref(null);

onMounted(() => {
  const storedAuth = localStorage.getItem("authData");
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      authData.value = parsed;
      profile.value = parsed.profile;
    } catch (error) {
      navigateTo("/");
    }
  }
});

// Função para recarregar dados após salvar profile
const handleProfileSave = async () => {
  // Recarregar dados do localStorage
  const storedAuth = localStorage.getItem("authData");
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      profile.value = parsed.profile;
    } catch (error) {
      navigateTo("/");
    }
  }
};
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
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Editar Perfil</h1>
        <p class="text-gray-600">
          Configure as informações básicas do seu perfil
        </p>
      </div>

      <!-- Loading -->
      <div v-if="!profile" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p>Carregando dados...</p>
      </div>

      <!-- Conteúdo Principal -->
      <div
        v-else-if="profile"
        class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
      >
        <ProfileEditor :profile="profile" @save-profile="handleProfileSave" />
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

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

/* Bordas */
.rounded-lg {
  border-radius: 0.5rem;
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

/* Texto centralizado */
.text-center {
  text-align: center;
}
</style>
