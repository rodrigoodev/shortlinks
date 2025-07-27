<script setup>
// Importar VueDraggable
let VueDraggable = null;

// Carregar VueDraggable dinamicamente
onMounted(async () => {
  try {
    const draggableModule = await import("vuedraggable");
    VueDraggable = draggableModule.default || draggableModule.VueDraggable;
  } catch (error) {
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
    const response = await $fetch(`/api/links?profile_id=${props.profileId}`);

    if (response?.success) {
      links.value = response.links;
    } else {
      message.value =
        "❌ Erro ao carregar links: " +
        (response?.message || "Erro desconhecido");
    }
  } catch (error) {
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

    const response = await $fetch(url, { method, body });

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
    message.value = "❌ Erro ao reordenar links";
  }

  setTimeout(() => (message.value = ""), 3000);
};

// Carregar links ao montar componente
onMounted(async () => {
  // Carregar VueDraggable primeiro
  try {
    const draggableModule = await import("vuedraggable");
    VueDraggable = draggableModule.default || draggableModule.VueDraggable;
  } catch (error) {
    VueDraggable = "div";
  }

  // Depois carregar os links
  fetchLinks();
});
</script>

<template>
  <div class="link-manager">
    <!-- Header -->
    <div class="link-manager-header">
      <h2 class="link-manager-title">Gerenciar Links</h2>
      <button @click="newLink" class="new-link-button">➕ Novo Link</button>
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
          <div class="link-item">
            <div class="link-content">
              <!-- Handle de arrasto -->
              <div class="drag-handle">☰</div>

              <!-- Preview do link -->
              <div class="link-preview">
                <div class="link-info">
                  <!-- Ícone/Imagem -->
                  <div v-if="link.image_url" class="link-icon">
                    <img
                      :src="link.image_url"
                      :alt="link.text_link || 'Link'"
                      class="icon-image"
                    />
                  </div>

                  <!-- Texto -->
                  <div class="link-text">
                    <div
                      class="link-title"
                      :title="link.type === 'text' ? link.text_link : 'Imagem'"
                    >
                      {{
                        link.type === "text"
                          ? truncateText(link.text_link, 20)
                          : "Imagem"
                      }}
                    </div>
                    <div class="link-url" :title="link.link_url">
                      {{ truncateText(link.link_url, 25) }}
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="link-status">
                    <span
                      :class="[
                        'status-badge',
                        link.is_active ? 'active' : 'inactive',
                      ]"
                    >
                      {{ link.is_active ? "Ativo" : "Inativo" }}
                    </span>
                    <span class="order-number">#{{ link.order_index }}</span>
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="link-actions">
                <button
                  @click="editLink(link)"
                  class="action-button edit"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  @click="deleteLink(link.id)"
                  class="action-button delete"
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
    <div v-if="showForm" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">
          {{ editingLink ? "Editar Link" : "Novo Link" }}
        </h3>

        <form @submit.prevent="saveLink" class="link-form">
          <!-- Tipo do Link -->
          <div class="form-group">
            <label class="form-label">Tipo do Link</label>
            <select v-model="form.type" class="form-input">
              <option value="text">Texto com Ícone</option>
              <option value="image">Imagem Completa</option>
            </select>
          </div>

          <!-- URL da Imagem -->
          <div class="form-group">
            <label class="form-label">
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
              class="form-input"
            />
          </div>

          <!-- Texto (apenas para tipo text) -->
          <div v-if="form.type === 'text'" class="form-group">
            <label class="form-label">Texto</label>
            <input
              v-model="form.text_link"
              type="text"
              placeholder="Ex: Fale conosco no WhatsApp"
              required
              class="form-input"
            />
          </div>

          <!-- URL de Destino -->
          <div class="form-group">
            <label class="form-label">URL de Destino</label>
            <input
              v-model="form.link_url"
              type="url"
              placeholder="https://exemplo.com"
              required
              class="form-input"
            />
          </div>

          <!-- Cores -->
          <div class="form-colors">
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
          <div class="form-buttons">
            <button
              type="button"
              @click="cancelEdit"
              class="form-button cancel"
            >
              Cancelar
            </button>
            <button type="submit" :disabled="saving" class="form-button save">
              {{ saving ? "Salvando..." : editingLink ? "Atualizar" : "Criar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Link Manager Principal */
.link-manager {
  width: 100%;
}

/* Header do Link Manager */
.link-manager-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.link-manager-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.new-link-button {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.new-link-button:hover {
  background-color: #1d4ed8;
}

/* Cards dos Links */
.link-item {
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.link-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Handle de arrasto */
.drag-handle {
  cursor: move;
  color: #9ca3af;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.drag-handle:hover {
  color: #6b7280;
}

/* Preview do link */
.link-preview {
  flex: 1;
  min-width: 0;
}

.link-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Ícone do link */
.link-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  overflow: hidden;
  flex-shrink: 0;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Texto do link */
.link-text {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-url {
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Status do link */
.link-status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.status-badge {
  padding: 0.125rem 0.25rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background-color: #f3f4f6;
  color: #374151;
}

.order-number {
  font-size: 0.75rem;
  color: #9ca3af;
  display: none;
}

/* Ações do link */
.link-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.action-button {
  padding: 0.375rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.action-button.edit {
  color: #2563eb;
}

.action-button.edit:hover {
  background-color: #eff6ff;
}

.action-button.delete {
  color: #dc2626;
}

.action-button.delete:hover {
  background-color: #fef2f2;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  z-index: 50;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

/* Formulário */
.link-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-colors {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.form-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
}

.form-button {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.form-button.cancel {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.form-button.cancel:hover {
  background-color: #f9fafb;
}

.form-button.save {
  background-color: #2563eb;
  color: white;
}

.form-button.save:hover {
  background-color: #1d4ed8;
}

.form-button.save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading */
.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsivo */
@media (min-width: 640px) {
  .link-manager-header {
    flex-direction: row;
    align-items: center;
    gap: 0;
    margin-bottom: 1.5rem;
  }

  .link-manager-title {
    font-size: 1.5rem;
  }

  .new-link-button {
    width: auto;
    font-size: 1rem;
  }

  .link-item {
    padding: 1rem;
  }

  .link-info {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }

  .link-icon {
    width: 2rem;
    height: 2rem;
  }

  .link-title {
    font-size: 1rem;
  }

  .link-url {
    font-size: 0.875rem;
  }

  .link-status {
    gap: 0.5rem;
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
  }

  .order-number {
    display: inline;
  }

  .link-actions {
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .link-form {
    gap: 1rem;
  }

  .form-group {
    gap: 0.5rem;
  }

  .form-input {
    padding: 0.75rem;
    font-size: 1rem;
  }

  .form-colors {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .form-buttons {
    flex-direction: row;
    gap: 0.75rem;
    padding-top: 1rem;
  }

  .form-button {
    width: auto;
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}
</style>
