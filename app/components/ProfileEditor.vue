<script setup>
// Props
const props = defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

// Emit para salvar profile
const emit = defineEmits(["save-profile"]);

// Formulário reativo
const form = ref({
  id: 1,
  name: "",
  description: "",
  image_url: "",
  background_color: "#ffffff",
  slug: "",
});

// Estados para feedback
const saving = ref(false);
const saveMessage = ref("");

// Observar mudanças nos dados e preencher formulário
watch(
  () => props.profile,
  (newProfile) => {
    if (newProfile) {
      form.value = {
        id: newProfile.id,
        name: newProfile.name || "",
        description: newProfile.description || "",
        image_url: newProfile.image_url || "",
        background_color: newProfile.background_color || "#ffffff",
        slug: newProfile.slug || "",
      };
    }
  },
  { immediate: true }
);

// Função para salvar profile
const saveProfile = async () => {
  saving.value = true;
  try {
    const response = await $fetch("/api/profile", {
      method: "PUT",
      body: form.value,
    });

    if (response.success) {
      saveMessage.value = "✅ Profile salvo com sucesso!";
      emit("save-profile");
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        saveMessage.value = "";
      }, 3000);
    } else {
      saveMessage.value = "❌ Erro ao salvar: " + response.message;
    }
  } catch (error) {
    saveMessage.value = "❌ Erro ao salvar profile";
  } finally {
    saving.value = false;
  }
};

// Função para verificar tabela
const checkTable = async () => {
  try {
    const response = await $fetch("/api/check-table");
    alert("Verificação concluída! Veja o console para detalhes.");
  } catch (error) {
    alert("Erro ao verificar tabela");
  }
};
</script>

<template>
  <div class="profile-editor">
    <!-- Mensagens -->
    <div v-if="saveMessage" class="mb-6 p-4 rounded-lg text-center font-medium">
      {{ saveMessage }}
    </div>

    <!-- Formulário do Profile -->
    <form @submit.prevent="saveProfile" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Nome</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Seu nome"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Descrição</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Sua descrição"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">URL da Imagem</label>
        <input
          v-model="form.image_url"
          type="url"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Cor de Fundo</label>
        <input
          v-model="form.background_color"
          type="color"
          class="w-full h-12 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Slug</label>
        <input
          v-model="form.slug"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="seu-slug"
        />
      </div>

      <button
        type="submit"
        :disabled="saving"
        class="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium shadow-lg transition-all duration-200"
      >
        {{ saving ? "Salvando..." : "Salvar Profile" }}
      </button>
    </form>

    <!-- Dados do Profile -->
    <div v-if="profile" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-medium mb-2">Profile Carregado:</h3>
      <pre class="text-sm text-gray-600 overflow-auto">{{
        JSON.stringify(profile, null, 2)
      }}</pre>
    </div>

    <!-- Botão de Verificação -->
    <!-- <div class="mb-6">
      <button
        type="button"
        @click="checkTable"
        class="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-medium shadow-lg transition-all duration-200"
      >
        🔍 Verificar Tabela
      </button>
    </div> -->
  </div>
</template>

<style scoped>
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
.w-full {
  width: 100%;
}

/* Espaçamento */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-4 {
  padding: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Tamanhos */
.h-12 {
  height: 3rem;
}

/* Bordas */
.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

/* Cores */
.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-600 {
  background-color: #4b5563;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-900 {
  color: #111827;
}

.text-white {
  color: #ffffff;
}

/* Sombras */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
.text-2xl {
  font-size: 1.5rem;
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

/* Texto centralizado */
.text-center {
  text-align: center;
}

/* Overflow */
.overflow-auto {
  overflow: auto;
}
</style>
