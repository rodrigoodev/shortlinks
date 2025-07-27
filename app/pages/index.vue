<script setup>
// Buscar dados do profile
const { data: profileData, error } = await useFetch("/api/hello");

// Buscar links do profile
const { data: linksData, error: linksError } = await useFetch("/api/links");

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

// Lead capture form
const leadForm = ref({
  email: "",
  celular: "",
});

const showLeadModal = ref(false);
const submitting = ref(false);
const leadMessage = ref("");
const leadSuccess = ref(false);
const leadError = ref(false);

const closeModal = () => {
  showLeadModal.value = false;
  // Limpar formulário e mensagens ao fechar
  leadForm.value.email = "";
  leadForm.value.celular = "";
  leadMessage.value = "";
  leadError.value = false;
};

const copyNumber = async () => {
  try {
    await navigator.clipboard.writeText("12988251071");
    // Feedback visual temporário
    const btn = document.querySelector(".phone-btn");
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = "✅ Copiado!";
      btn.style.background = "#16a34a";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "#667eea";
      }, 2000);
    }
  } catch (error) {
    // Erro silencioso ao copiar número
  }
};

const submitLead = async () => {
  // Validação
  if (!leadForm.value.email && !leadForm.value.celular) {
    leadError.value = true;
    leadMessage.value = "Por favor, informe seu email ou celular";
    leadSuccess.value = false;
    return;
  }

  leadError.value = false;
  submitting.value = true;
  leadMessage.value = "";

  try {
    const response = await $fetch("/api/leads", {
      method: "POST",
      body: {
        email: leadForm.value.email,
        celular: leadForm.value.celular,
        source: "footer",
      },
    });

    if (response.success) {
      leadSuccess.value = true;

      if (response.urgency) {
        leadMessage.value = `✅ Obrigado! Entraremos em contato em breve!
        
🚨 URGÊNCIA: Se precisar para agora:`;
      } else {
        leadMessage.value = "✅ Obrigado! Entraremos em contato em breve!";
      }

      // Limpar formulário
      leadForm.value.email = "";
      leadForm.value.celular = "";

      // Modal permanece aberto para o usuário ler e usar os botões
    } else {
      leadSuccess.value = false;
      leadMessage.value = "❌ " + response.message;
    }
  } catch (error) {
    leadSuccess.value = false;
    leadMessage.value = "❌ Erro ao enviar dados. Tente novamente.";
  } finally {
    submitting.value = false;
  }
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
      </div>

      <!-- Footer -->
      <div class="mt-12 text-center">
        <!-- CTA Discreto -->
        <button @click="showLeadModal = true" class="footer-cta">
          <span>💡</span>
          <span>Quero meu perfil de links também!</span>
        </button>

        <div class="mt-4 opacity-60">
          <p class="text-sm">Powered by ShortLinks</p>
        </div>
      </div>

      <!-- Modal de Lead Capture -->
      <div v-if="showLeadModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Crie seu perfil personalizado</h3>
            <button @click="closeModal" class="modal-close">
              <span>×</span>
            </button>
          </div>

          <p class="modal-description">
            Tenha sua própria página de links como esta! Deixe seus dados que
            entraremos em contato.
          </p>

          <form @submit.prevent="submitLead" class="modal-form">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input
                v-model="leadForm.email"
                type="email"
                placeholder="seu@email.com"
                class="form-input"
                :class="{ error: leadError }"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Celular (opcional)</label>
              <input
                v-model="leadForm.celular"
                type="tel"
                placeholder="(11) 99999-9999"
                class="form-input"
              />
            </div>

            <button type="submit" :disabled="submitting" class="modal-button">
              <span v-if="submitting" class="loading-spinner"></span>
              {{ submitting ? "Enviando..." : "Quero criar meu perfil!" }}
            </button>
          </form>

          <div
            v-if="leadMessage"
            class="modal-message"
            :class="leadSuccess ? 'success' : 'error'"
          >
            {{ leadMessage }}

            <!-- Botões de contato se for sucesso -->
            <div v-if="leadSuccess" class="contact-buttons">
              <a
                href="https://wa.me/5512988251071?text=vim%20pelo%20shortlinks%20quero%20meu%20tbm"
                target="_blank"
                class="contact-btn whatsapp-btn"
              >
                📱 WhatsApp
              </a>
              <button @click="copyNumber" class="contact-btn phone-btn">
                📞 Copiar telefone
              </button>
            </div>
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

/* Footer CTA */
.footer-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  color: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  opacity: 0.7;
}

.footer-cta:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #1f2937;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.modal-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.modal-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.modal-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.modal-message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.modal-message.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #16a34a;
  white-space: pre-line;
  line-height: 1.6;
}

.modal-message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.contact-buttons {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-btn {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  min-width: 120px;
  justify-content: center;
}

.whatsapp-btn {
  background: #25d366;
  color: white;
}

.whatsapp-btn:hover {
  background: #128c7e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.phone-btn {
  background: #667eea;
  color: white;
}

.phone-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Modal Animation */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .modal-content {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-description {
    font-size: 0.8rem;
  }
}
</style>
