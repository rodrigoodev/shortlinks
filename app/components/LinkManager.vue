<script setup>
// Importar VueDraggable
let VueDraggable = null;

// Carregar VueDraggable dinamicamente
onMounted(async () => {
  try {
    const draggableModule = await import("vuedraggable");
    VueDraggable = draggableModule.default || draggableModule.VueDraggable;
    console.log("🔍 VueDraggable carregado:", VueDraggable);
  } catch (error) {
    console.error("❌ Erro ao carregar VueDraggable:", error);
    // Fallback para div simples
    VueDraggable = "div";
  }
});

// Props
const props = defineProps({
  profileId: {
    type: Number,
    required: true,
  },
});

// Estados reativos
const links = ref([]);
const loading = ref(false);
const message = ref("");
const showForm = ref(false);
const saving = ref(false);
const editingLink = ref(null);

// Formulário
const form = ref({
  type: "text",
  image_url: "",
  text_link: "",
  link_url: "",
  is_active: true,
  background_color: "#ffffff",
  border_color: "#cccccc",
});

// Buscar links
const fetchLinks = async () => {
  loading.value = true;
  try {
    console.log("🔍 Iniciando busca de links...");
    console.log("🔍 Profile ID:", props.profileId);

    const response = await $fetch("/api/links");
    console.log("🔍 Resposta da API:", response);

    if (response?.success) {
      links.value = response.links;
      console.log("✅ Links carregados:", links.value);
    } else {
      console.log("❌ API retornou erro:", response);
      message.value =
        "❌ Erro ao carregar links: " +
        (response?.message || "Erro desconhecido");
    }
  } catch (error) {
    console.error("Erro ao buscar links:", error);
    message.value = "❌ Erro ao carregar links";
  } finally {
    loading.value = false;
  }
};

// Função para truncar texto
const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Novo link
const newLink = () => {
  editingLink.value = null;
  form.value = {
    type: "text",
    image_url: "",
    text_link: "",
    link_url: "",
    is_active: true,
    background_color: "#ffffff",
    border_color: "#cccccc",
  };
  showForm.value = true;
};

// Salvar link
const saveLink = async () => {
  saving.value = true;
  try {
    const url = editingLink.value ? "/api/links" : "/api/links";
    const method = editingLink.value ? "PUT" : "POST";
    const body = editingLink.value
      ? { ...form.value, id: editingLink.value.id }
      : { ...form.value, profile_id: props.profileId };

    console.log("🔍 Salvando link...");
    console.log("🔍 URL:", url);
    console.log("🔍 Method:", method);
    console.log("🔍 Body:", body);

    const response = await $fetch(url, { method, body });

    console.log("🔍 Resposta da API:", response);

    if (response.success) {
      message.value = editingLink.value
        ? "✅ Link atualizado com sucesso!"
        : "✅ Link criado com sucesso!";

      await fetchLinks();
      showForm.value = false;
    } else {
      message.value = "❌ " + response.message;
    }
  } catch (error) {
    console.error("❌ Erro ao salvar link:", error);
    message.value = "❌ Erro ao salvar link: " + error.message;
  } finally {
    saving.value = false;
    setTimeout(() => (message.value = ""), 3000);
  }
};

// Editar link
const editLink = (link) => {
  editingLink.value = link;
  form.value = {
    type: link.type,
    image_url: link.image_url || "",
    text_link: link.text_link || "",
    link_url: link.link_url,
    is_active: link.is_active === 1,
    background_color: link.background_color || "#ffffff",
    border_color: link.border_color || "#cccccc",
    order_index: link.order_index, // Adicionar order_index
  };
  showForm.value = true;
};

// Deletar link
const deleteLink = async (linkId) => {
  if (!confirm("Tem certeza que deseja deletar este link?")) return;

  try {
    const response = await $fetch("/api/links", {
      method: "DELETE",
      body: { id: linkId },
    });

    if (response.success) {
      message.value = "✅ Link deletado com sucesso!";
      await fetchLinks();
    } else {
      message.value = "❌ " + response.message;
    }
  } catch (error) {
    console.error("Erro ao deletar link:", error);
    message.value = "❌ Erro ao deletar link";
  }

  setTimeout(() => (message.value = ""), 3000);
};

// Cancelar edição
const cancelEdit = () => {
  showForm.value = false;
  editingLink.value = null;
};

// Reordenar links
const reorderLinks = async () => {
  try {
    console.log("🔄 Reordenando links...");
    const response = await $fetch("/api/links-reorder", {
      method: "POST",
      body: { links: links.value },
    });

    if (response.success) {
      message.value = "✅ Ordem atualizada com sucesso!";
    } else {
      message.value = "❌ " + response.message;
    }
  } catch (error) {
    console.error("Erro ao reordenar links:", error);
    message.value = "❌ Erro ao reordenar links";
  }

  setTimeout(() => (message.value = ""), 3000);
};

// Carregar links ao montar componente
onMounted(async () => {
  console.log("🔍 Componente LinkManager montado");
  console.log("🔍 Profile ID no onMounted:", props.profileId);

  // Carregar VueDraggable primeiro
  try {
    const draggableModule = await import("vuedraggable");
    VueDraggable = draggableModule.default || draggableModule.VueDraggable;
    console.log("🔍 VueDraggable carregado:", VueDraggable);
  } catch (error) {
    console.error("❌ Erro ao carregar VueDraggable:", error);
    VueDraggable = "div";
  }

  // Depois carregar os links
  fetchLinks();
});
</script>

<template>
  <div class="link-manager">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Gerenciar Links</h2>
      <button
        @click="newLink"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ➕ Novo Link
      </button>
    </div>

    <!-- Mensagens -->
    <div v-if="message" class="mb-4 p-3 rounded-lg text-center font-medium">
      {{ message }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
      ></div>
      <p>Carregando links...</p>
    </div>

    <!-- Lista de Links -->
    <div v-else class="space-y-4">
      <!-- Debug: Mostrar quantidade de links -->
      <div class="text-sm text-gray-500 mb-2">
        Total de links: {{ links.length }}
      </div>

      <!-- Mensagem quando não há links -->
      <div v-if="links.length === 0" class="text-center py-8 text-gray-500">
        <p>Nenhum link cadastrado ainda.</p>
        <p class="text-sm">Clique em "Novo Link" para começar!</p>
      </div>

      <!-- Lista de links com drag and drop -->
      <component
        :is="VueDraggable || 'div'"
        v-else
        v-model="links"
        @end="reorderLinks"
        :item-key="VueDraggable ? 'id' : undefined"
        :handle="VueDraggable ? '.drag-handle' : undefined"
        :ghost-class="VueDraggable ? 'opacity-50' : undefined"
        :chosen-class="VueDraggable ? 'shadow-lg' : undefined"
        class="space-y-3"
      >
        <template #item="{ element: link }">
          <div
            class="link-item bg-white rounded-lg p-4 shadow-md border border-gray-200"
          >
            <div class="flex items-center gap-3">
              <!-- Handle de arrasto -->
              <div
                class="drag-handle cursor-move text-gray-400 hover:text-gray-600"
              >
                ☰
              </div>

              <!-- Preview do link -->
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <!-- Ícone/Imagem -->
                  <div
                    v-if="link.image_url"
                    class="w-8 h-8 rounded overflow-hidden"
                  >
                    <img
                      :src="link.image_url"
                      :alt="link.text_link || 'Link'"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Texto -->
                  <div class="flex-1">
                    <div
                      class="font-medium"
                      :title="link.type === 'text' ? link.text_link : 'Imagem'"
                    >
                      {{
                        link.type === "text"
                          ? truncateText(link.text_link, 30)
                          : "Imagem"
                      }}
                    </div>
                    <div class="text-sm text-gray-500" :title="link.link_url">
                      {{ truncateText(link.link_url, 40) }}
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="flex items-center gap-2">
                    <span
                      :class="
                        link.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      "
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ link.is_active ? "Ativo" : "Inativo" }}
                    </span>

                    <span class="text-xs text-gray-400">
                      #{{ link.order_index }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="flex gap-2">
                <button
                  @click="editLink(link)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  @click="deleteLink(link.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </template>
      </component>
    </div>

    <!-- Modal de Formulário -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-xl font-bold mb-4">
          {{ editingLink ? "Editar Link" : "Novo Link" }}
        </h3>

        <form @submit.prevent="saveLink" class="space-y-4">
          <!-- Tipo do Link -->
          <div>
            <label class="block text-sm font-medium mb-2">Tipo do Link</label>
            <select
              v-model="form.type"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="text">Texto com Ícone</option>
              <option value="image">Imagem Completa</option>
            </select>
          </div>

          <!-- URL da Imagem -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ form.type === "text" ? "URL do Ícone" : "URL da Imagem" }}
            </label>
            <input
              v-model="form.image_url"
              type="url"
              :placeholder="
                form.type === 'text'
                  ? 'https://exemplo.com/icone.png'
                  : 'https://exemplo.com/imagem.jpg'
              "
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Texto (apenas para tipo text) -->
          <div v-if="form.type === 'text'">
            <label class="block text-sm font-medium mb-2">Texto</label>
            <input
              v-model="form.text_link"
              type="text"
              placeholder="Ex: Fale conosco no WhatsApp"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- URL de Destino -->
          <div>
            <label class="block text-sm font-medium mb-2">URL de Destino</label>
            <input
              v-model="form.link_url"
              type="url"
              placeholder="https://exemplo.com"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Cores -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Cor de Fundo</label>
              <input
                v-model="form.background_color"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Cor da Borda</label>
              <input
                v-model="form.border_color"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <!-- Ativo/Inativo -->
          <div class="flex items-center gap-3">
            <input
              v-model="form.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="is_active" class="text-sm font-medium"
              >Link ativo</label
            >
          </div>

          <!-- Preview -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-medium mb-2">Preview:</h4>
            <div
              class="p-3 rounded-lg border-2 transition-all"
              :style="{
                backgroundColor: form.background_color,
                borderColor: form.border_color,
              }"
            >
              <div v-if="form.type === 'text'" class="flex items-center gap-3">
                <img
                  v-if="form.image_url"
                  :src="form.image_url"
                  class="w-6 h-6 rounded"
                  @error="$event.target.style.display = 'none'"
                />
                <span class="font-medium">{{
                  truncateText(form.text_link || "Texto do link", 25)
                }}</span>
              </div>
              <div v-else class="text-center">
                <img
                  v-if="form.image_url"
                  :src="form.image_url"
                  class="w-full h-32 object-cover rounded"
                  @error="$event.target.style.display = 'none'"
                />
                <div
                  v-else
                  class="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500"
                >
                  Imagem
                </div>
              </div>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ saving ? "Salvando..." : editingLink ? "Atualizar" : "Criar" }}
            </button>
          </div>
        </form>
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
.flex {
  display: flex;
}

.flex-1 {
  flex: 1 1 0%;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

/* Grid */
.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

/* Espaçamento */
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

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

.p-3 {
  padding: 0.75rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.pt-4 {
  padding-top: 1rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* Bordas */
.rounded {
  border-radius: 0.25rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-full {
  border-radius: 9999px;
}

.border {
  border-width: 1px;
}

.border-2 {
  border-width: 2px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.border-blue-600 {
  border-color: #2563eb;
}

.border-b-2 {
  border-bottom-width: 2px;
}

/* Cores */
.bg-white {
  background-color: #ffffff;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.bg-black {
  background-color: #000000;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
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

.text-green-800 {
  color: #166534;
}

.text-gray-800 {
  color: #1f2937;
}

.text-white {
  color: #ffffff;
}

/* Sombras */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Texto */
.text-2xl {
  font-size: 1.5rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

/* Texto truncado */
.font-medium {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-sm {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Hover */
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.hover\:bg-red-50:hover {
  background-color: #fef2f2;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
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

/* Disabled */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

/* Dimensões */
.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

.w-full {
  width: 100%;
}

.h-10 {
  height: 2.5rem;
}

.h-32 {
  height: 8rem;
}

.max-w-md {
  max-width: 28rem;
}

.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Posicionamento */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

/* Opacidade */
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Overflow */
.overflow-hidden {
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Object fit */
.object-cover {
  object-fit: cover;
}

/* Display */
.block {
  display: block;
}

.inline-block {
  display: inline-block;
}

/* Cursor */
.cursor-move {
  cursor: move;
}

/* Drag and Drop */
.drag-handle:hover {
  color: #4b5563;
}

.opacity-50 {
  opacity: 0.5;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
