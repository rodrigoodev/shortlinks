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
  password: "",
});

// Estados para feedback
const saving = ref(false);
const saveMessage = ref("");

// Slug availability state
const slugStatus = ref({ available: false, message: "" });

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
        password: newProfile.password || "",
      };

      // Marcar o slug atual como disponível
      if (newProfile.slug) {
        slugStatus.value = { available: true, message: "Instagram atual" };
      }
    }
  },
  { immediate: true, deep: true }
);

// Validação do slug
const validateSlug = (slug) => {
  return slug.toLowerCase().replace(/[^a-z0-9_]/g, "");
};

// Validação mais rigorosa do slug
const isValidSlug = (slug) => {
  // Deve ter pelo menos 3 caracteres
  if (slug.length < 3) return false;

  // Deve conter apenas letras, números e underscore
  if (!/^[a-z0-9_]+$/.test(slug)) return false;

  // Não pode começar ou terminar com underscore
  if (slug.startsWith("_") || slug.endsWith("_")) return false;

  // Não pode ter underscores consecutivos
  if (slug.includes("__")) return false;

  return true;
};

// Verificar se slug está disponível
const checkSlugAvailability = async (slug) => {
  if (!slug) return { available: false, message: "Digite um Instagram" };

  const cleanSlug = validateSlug(slug);

  // Validação rigorosa do slug
  if (!isValidSlug(cleanSlug)) {
    return {
      available: false,
      message:
        "Instagram deve ter pelo menos 3 caracteres e conter apenas letras, números e underscore",
    };
  }

  // Se é o slug atual do perfil, está sempre disponível
  if (cleanSlug === props.profile?.slug) {
    return { available: true, message: "Instagram atual" };
  }

  try {
    const response = await $fetch(`/api/profile/${cleanSlug}`);

    // Se success é true, significa que o perfil existe
    // Se for o mesmo perfil (mesmo ID), está disponível
    if (response.success && response.profile.id !== form.value.id) {
      return { available: false, message: "Este Instagram já está em uso" };
    } else {
      return { available: true, message: "Instagram disponível!" };
    }
  } catch (error) {
    // Em caso de erro na requisição, consideramos como disponível
    return { available: true, message: "Instagram disponível!" };
  }
};

// Watch slug changes
watch(
  () => form.value.slug,
  async (newSlug) => {
    if (newSlug) {
      slugStatus.value = await checkSlugAvailability(newSlug);
    } else {
      slugStatus.value = { available: false, message: "" };
    }
  },
  { debounce: 500 }
);

// Função para salvar profile
const saveProfile = async () => {
  // Validações
  if (!form.value.slug) {
    saveMessage.value = "❌ Instagram é obrigatório";
    return;
  }

  if (!slugStatus.value.available) {
    saveMessage.value = "❌ Escolha um Instagram disponível";
    return;
  }

  saving.value = true;
  try {
    // Limpar espaços extras do nome
    const cleanName = form.value.name.trim();
    const cleanSlug = validateSlug(form.value.slug);

    // Preparar dados para envio (sem senha vazia)
    const requestData = {
      ...form.value,
      name: cleanName,
      slug: cleanSlug,
    };

    // Remover senha se estiver vazia
    if (!requestData.password || requestData.password.trim() === "") {
      delete requestData.password;
    }

    const response = await $fetch("/api/profile", {
      method: "PUT",
      body: requestData,
    });

    if (response.success) {
      saveMessage.value =
        "✅ Profile salvo com sucesso! Os dados foram atualizados.";

      // Atualizar o localStorage com os novos dados
      const storedAuth = localStorage.getItem("authData");
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          const updatedProfile = {
            ...parsed.profile,
            name: cleanName,
            description: form.value.description || "",
            image_url: form.value.image_url || "",
            background_color: form.value.background_color || "#ffffff",
            slug: cleanSlug,
          };

          // Atualizar senha apenas se foi fornecida
          if (form.value.password && form.value.password.trim() !== "") {
            updatedProfile.password = form.value.password;
          }

          localStorage.setItem(
            "authData",
            JSON.stringify({
              ...parsed,
              profile: updatedProfile,
            })
          );

          // Atualizar o form local com os novos dados
          form.value.name = cleanName;
          form.value.description = form.value.description || "";
          form.value.image_url = form.value.image_url || "";
          form.value.background_color =
            form.value.background_color || "#ffffff";
          form.value.slug = cleanSlug;
          // Manter senha apenas se foi fornecida, senão limpar o campo
          if (!form.value.password || form.value.password.trim() === "") {
            form.value.password = "";
          }
        } catch (error) {
          console.error("Erro ao atualizar localStorage:", error);
        }
      }

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
        <label class="block text-sm font-medium mb-2">Instagram (Slug)</label>
        <div class="relative">
          <span
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >@</span
          >
          <input
            v-model="form.slug"
            type="text"
            class="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': !slugStatus.available && form.slug }"
            placeholder="seuinstagram"
          />
        </div>
        <p
          v-if="slugStatus.message"
          class="text-xs mt-1"
          :class="slugStatus.available ? 'text-green-600' : 'text-red-600'"
        >
          {{ slugStatus.message }}
        </p>
        <p v-else class="text-xs text-gray-500 mt-1">
          Digite apenas o nome do seu Instagram (sem @)
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Senha</label>
        <input
          v-model="form.password"
          type="password"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Sua senha"
        />
        <p class="text-xs text-gray-500 mt-1">
          Senha para acessar o editor do seu perfil
        </p>
      </div>

      <button
        type="submit"
        :disabled="saving || !slugStatus.available"
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

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  z-index: 1;
}

.pl-8 {
  padding-left: 2rem;
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
