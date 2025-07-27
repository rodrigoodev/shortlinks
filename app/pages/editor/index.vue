<script setup>
const { data: page, error, refresh } = await useFetch("/api/hello");

console.log("Dados da API:", page.value);
console.log("Erro:", error.value);

// Formulário reativo
const form = ref({
  id: 1,
  name: "",
  description: "",
  image_url: "",
  background_color: "#ffffff",
  slug: "",
});

// Carregar dados no formulário quando a página carregar
watch(
  page,
  (newPage) => {
    if (newPage && newPage.profile) {
      form.value = {
        id: newPage.profile.id || 1,
        name: newPage.profile.name || "",
        description: newPage.profile.description || "",
        image_url: newPage.profile.image_url || "",
        background_color: newPage.profile.background_color || "#ffffff",
        slug: newPage.profile.slug || "",
      };
    }
  },
  { immediate: true }
);

// Estado de salvamento
const saving = ref(false);
const saveMessage = ref("");

// Função para salvar dados
const saveProfile = async () => {
  try {
    saving.value = true;
    saveMessage.value = "";

    console.log("Enviando dados:", form.value);

    const response = await $fetch("/api/profile", {
      method: "PUT",
      body: form.value,
    });

    console.log("Resposta da API:", response);

    if (response.success) {
      saveMessage.value = "✅ Profile salvo com sucesso!";
      // Recarregar dados
      await refresh();
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        saveMessage.value = "";
      }, 3000);
    } else {
      saveMessage.value = "❌ Erro ao salvar: " + response.message;
    }
  } catch (error) {
    console.error("Erro ao salvar:", error);
    saveMessage.value = "❌ Erro ao salvar profile: " + error.message;
  } finally {
    saving.value = false;
  }
};

// Função para verificar a tabela
const checkTable = async () => {
  try {
    console.log("Verificando tabela...");
    const response = await $fetch("/api/check-table");
    console.log("Estrutura da tabela:", response);
    alert(`Status: ${response.action}\nMensagem: ${response.message}`);
  } catch (error) {
    console.error("Erro ao verificar tabela:", error);
    alert("Erro ao verificar tabela: " + error.message);
  }
};
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Editor de Profile</h1>

    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <strong>Erro:</strong> {{ error.message }}
    </div>

    <!-- Mensagem de salvamento -->
    <div
      v-if="saveMessage"
      :class="
        saveMessage.includes('✅')
          ? 'bg-green-100 border-green-400 text-green-700'
          : 'bg-red-100 border-red-400 text-red-700'
      "
      class="border px-4 py-3 rounded mb-4"
    >
      {{ saveMessage }}
    </div>

    <!-- Formulário de Edição -->
    <div
      v-if="page && page.profile"
      class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
    >
      <h2 class="text-xl font-semibold mb-6">Editar Profile</h2>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              placeholder="Nome do profile"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              placeholder="dois-coracoes"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm resize-none"
            placeholder="Descrição do profile"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            URL da Imagem
          </label>
          <input
            v-model="form.image_url"
            type="url"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cor de Fundo
          </label>
          <div class="flex items-center space-x-4">
            <input
              v-model="form.background_color"
              type="color"
              class="w-16 h-12 border border-gray-200 rounded-xl cursor-pointer shadow-sm"
            />
            <input
              v-model="form.background_color"
              type="text"
              class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-mono text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div class="flex justify-between pt-4">
          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span v-if="saving" class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Salvando...</span>
            </span>
            <span v-else>💾 Salvar Profile</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Visualização dos Dados -->
    <div
      v-if="page"
      class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <button
        type="button"
        @click="checkTable"
        class="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-medium shadow-lg transition-all duration-200"
      >
        🔍 Verificar Tabela
      </button>
      <h2 class="text-xl font-semibold mb-4">Dados Atuais</h2>

      <div class="mb-4"><strong>Mensagem:</strong> {{ page.message }}</div>

      <div v-if="page.profile" class="border p-4 rounded">
        <pre>{{ JSON.stringify(page.profile, null, 2) }}</pre>
      </div>

      <div v-else class="text-gray-500">
        Nenhum profile encontrado na tabela.
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p>Carregando dados...</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.p-6 {
  padding: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.text-center {
  text-align: center;
}

.text-3xl {
  font-size: 1.875rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.font-medium {
  font-weight: 500;
}

.text-gray-500 {
  color: #6b7280;
}

.text-red-700 {
  color: #b91c1c;
}

.text-green-700 {
  color: #047857;
}

.border-green-400 {
  border-color: #4ade80;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.bg-white {
  background-color: #ffffff;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.border {
  border-width: 1px;
}

.border-red-400 {
  border-color: #f87171;
}

.rounded {
  border-radius: 0.25rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-2xl {
  border-radius: 1rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

pre {
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  overflow-x: auto;
}

/* Grid */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.md\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

/* Form elements */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.block {
  display: block;
}

.w-full {
  width: 100%;
}

.h-12 {
  height: 3rem;
}

.rows-3 {
  rows: 3;
}

/* Focus states */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

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

/* Button states */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Cores de borda */
.border-gray-200 {
  border-color: #e5e7eb;
}

.border-gray-100 {
  border-color: #f3f4f6;
}

.border-blue-500 {
  border-color: #3b82f6;
}

/* Gradientes */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-blue-600 {
  --tw-gradient-from: #2563eb;
  --tw-gradient-stops: var(--tw-gradient-from),
    var(--tw-gradient-to, rgba(37, 99, 235, 0));
}

.to-blue-700 {
  --tw-gradient-to: #1d4ed8;
}

.hover\:from-blue-700:hover {
  --tw-gradient-from: #1d4ed8;
}

.hover\:to-blue-800:hover {
  --tw-gradient-to: #1e40af;
}

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

/* Transformações */
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\:scale-105:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
}

/* Espaçamento */
.space-x-4 > * + * {
  margin-left: 1rem;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

/* Flexbox */
.flex {
  display: flex;
}

.flex-1 {
  flex: 1 1 0%;
}

.items-center {
  align-items: center;
}

/* Tamanhos */
.w-16 {
  width: 4rem;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

/* Tipografia */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas,
    "Liberation Mono", Menlo, monospace;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

/* Padding */
.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.p-8 {
  padding: 2rem;
}

.mb-8 {
  margin-bottom: 2rem;
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

/* Cores de fundo */
.bg-gray-600 {
  background-color: #8ea1bb;
}

.hover\:bg-gray-700:hover {
  background-color: #374151;
}

/* Responsive */
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
