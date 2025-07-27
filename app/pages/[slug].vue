<script setup>
// Obter o slug da URL
const route = useRoute();
const slug = route.params.slug;

// Composable para gerenciar o modal
const useModal = () => {
  const showModal = useState("showModal", () => false);
  const isRegistering = useState("isRegistering", () => false);
  const isLoggingIn = useState("isLoggingIn", () => false);

  const openRegister = () => {
    showModal.value = true;
    isRegistering.value = true;
    isLoggingIn.value = false;
  };

  const openLogin = () => {
    showModal.value = true;
    isRegistering.value = false;
    isLoggingIn.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    isRegistering.value = false;
    isLoggingIn.value = false;
  };

  const switchToLogin = () => {
    isRegistering.value = false;
    isLoggingIn.value = true;
  };

  const switchToRegister = () => {
    isRegistering.value = true;
    isLoggingIn.value = false;
  };

  return {
    showModal,
    isRegistering,
    isLoggingIn,
    openRegister,
    openLogin,
    closeModal,
    switchToLogin,
    switchToRegister,
  };
};

// Buscar dados do perfil
const { data: profileData, error: profileError } = await useFetch(
  `/api/profile/${slug}`
);

// Buscar links do perfil
const { data: linksData, error: linksError } = await useFetch(
  `/api/links/${slug}`
);

// Computed para verificar se o perfil existe
const profile = computed(() => profileData.value?.profile || null);
const links = computed(() => linksData.value?.links || []);
const profileExists = computed(() => profile.value !== null);

// Função para obter cor de contraste
const getContrastColor = (backgroundColor) => {
  if (!backgroundColor) return "#000000";

  // Remove # se presente
  const hex = backgroundColor.replace("#", "");

  // Converte para RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calcula luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Função para truncar texto
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Função para copiar número
const copyNumber = async () => {
  try {
    await navigator.clipboard.writeText("12988251071");
    // Feedback visual pode ser adicionado aqui
  } catch (error) {
    // Fallback para navegadores que não suportam clipboard API
  }
};

// Modal de autenticação
const { openRegister, openLogin } = useModal();
</script>

<template>
  <!-- Página não encontrada -->
  <div v-if="!profileExists" class="not-found-page">
    <div class="not-found-content">
      <h1 class="not-found-title">Perfil não encontrado</h1>
      <p class="not-found-description">
        O perfil "{{ slug }}" não existe ou foi removido.
      </p>
      <NuxtLink to="/" class="not-found-link"> Voltar ao início </NuxtLink>
    </div>
  </div>

  <!-- Página do perfil -->
  <div
    v-else
    class="profile-page"
    :style="{ backgroundColor: profile.background_color || '#f8fafc' }"
  >
    <div class="profile-container">
      <!-- Header do perfil -->
      <div class="profile-header">
        <div v-if="profile.image_url" class="profile-image">
          <img :src="profile.image_url" :alt="profile.name" class="image" />
        </div>
        <h1
          class="profile-name"
          :style="{ color: getContrastColor(profile.background_color) }"
        >
          {{ profile.name }}
        </h1>
        <p
          v-if="profile.description"
          class="profile-description"
          :style="{ color: getContrastColor(profile.background_color) }"
        >
          {{ profile.description }}
        </p>
      </div>

      <!-- Links -->
      <div class="links-section">
        <div v-for="link in links" :key="link.id" class="link-item">
          <a
            :href="link.link_url"
            target="_blank"
            rel="noopener noreferrer"
            class="link-button"
            :style="{
              backgroundColor: link.background_color || '#ffffff',
              borderColor: link.border_color || '#e5e7eb',
            }"
          >
            <div v-if="link.type === 'text'" class="text-link">
              <div v-if="link.image_url" class="link-icon">
                <img :src="link.image_url" :alt="link.text_link" class="icon" />
              </div>
              <span
                class="link-text"
                :style="{
                  color: getContrastColor(link.background_color || '#ffffff'),
                }"
              >
                {{ link.text_link }}
              </span>
            </div>
            <div v-else class="image-link">
              <img
                :src="link.image_url"
                :alt="link.text_link || 'Link'"
                class="link-image"
              />
            </div>
          </a>
        </div>
      </div>

      <!-- Footer com CTAs -->
      <div class="profile-footer">
        <div class="footer-buttons">
          <button @click="openRegister" class="footer-cta primary">
            <span>🚀</span>
            <span>Criar minha página</span>
          </button>
          <button @click="openLogin" class="footer-cta secondary">
            <span>🔐</span>
            <span>Entrar no perfil</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal global de autenticação -->
    <AuthModal />
  </div>
</template>

<style scoped>
/* Página não encontrada */
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 1rem;
}

.not-found-content {
  text-align: center;
  max-width: 400px;
}

.not-found-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.not-found-description {
  color: #6b7280;
  margin-bottom: 2rem;
}

.not-found-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.not-found-link:hover {
  background-color: #1d4ed8;
}

/* Página do perfil */
.profile-page {
  min-height: 100vh;
  padding: 1rem;
  font-family: "Inter", sans-serif;
}

.profile-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 0;
}

/* Header do perfil */
.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-image {
  margin-bottom: 1rem;
}

.image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.profile-description {
  font-size: 0.95rem;
  opacity: 0.8;
  line-height: 1.5;
  max-width: 500px;
  margin: 0 auto;
}

/* Seção de links */
.links-section {
  margin-bottom: 2rem;
}

.link-item {
  margin-bottom: 0.75rem;
}

.link-button {
  display: block;
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
}

.link-button:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Link de texto */
.text-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.link-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.25rem;
}

.link-text {
  font-weight: 500;
  font-size: 0.95rem;
  text-align: left;
}

/* Link de imagem */
.image-link {
  text-align: center;
}

.link-image {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 0.5rem;
}

/* Footer */
.profile-footer {
  text-align: center;
  margin-top: 2rem;
}

.footer-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  color: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
}

.footer-cta.primary {
  background: rgba(255, 255, 255, 0.15);
  color: inherit;
  border-color: rgba(255, 255, 255, 0.3);
}

.footer-cta.primary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.footer-cta.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  opacity: 0.8;
}

.footer-cta.secondary:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

/* Responsivo */
@media (max-width: 640px) {
  .profile-container {
    padding: 1rem 0;
  }

  .profile-name {
    font-size: 1.25rem;
  }

  .profile-description {
    font-size: 0.875rem;
  }

  .link-button {
    padding: 0.75rem;
  }

  .link-text {
    font-size: 0.875rem;
  }

  .footer-buttons {
    flex-direction: column;
    align-items: center;
  }

  .footer-cta {
    width: 100%;
    max-width: 260px;
    justify-content: center;
  }
}
</style>
