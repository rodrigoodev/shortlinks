<script setup>
// Página de boas-vindas do ShortLinks
const router = useRouter();

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

// Estados do modal usando composable
const { showModal, isRegistering, isLoggingIn, openRegister, openLogin } =
  useModal();

// Exemplo de URL para o footer
const exampleUrl = computed(() => {
  return `${window.location.origin}/joaosilva`;
});
</script>

<template>
  <div class="welcome-page">
    <div class="welcome-container">
      <!-- Header -->
      <div class="welcome-header">
        <h1 class="welcome-title">ShortLinks</h1>
        <p class="welcome-subtitle">Crie sua página de links personalizada</p>
      </div>

      <!-- Features -->
      <div class="features-section">
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">Design Personalizado</h3>
          <p class="feature-description">
            Cores, imagens e layout totalmente customizáveis
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔗</div>
          <h3 class="feature-title">Links Organizados</h3>
          <p class="feature-description">Organize seus links com drag & drop</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3 class="feature-title">Responsivo</h3>
          <p class="feature-description">
            Funciona perfeitamente em mobile e desktop
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Rápido e Seguro</h3>
          <p class="feature-description">
            Hospedagem confiável e carregamento rápido
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <h2 class="cta-title">Crie sua página agora mesmo!</h2>
        <p class="cta-description">
          Registre-se e tenha sua página personalizada em segundos
        </p>
        <div class="cta-buttons">
          <button @click="openRegister" class="cta-button primary">
            🚀 Criar minha página
          </button>
          <button @click="openLogin" class="cta-button secondary">
            🔐 Já tenho conta
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="welcome-footer">
        <p class="footer-text">
          Exemplo: sua página ficará assim:
          <strong>{{ exampleUrl }}</strong>
        </p>
      </div>
    </div>

    <!-- Modal global de autenticação -->
    <AuthModal />
  </div>
</template>

<style scoped>
.welcome-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  font-family: "Inter", sans-serif;
}

.welcome-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.welcome-header {
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.cta-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 3rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-button.primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(240, 147, 251, 0.3);
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(240, 147, 251, 0.4);
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.welcome-footer {
  margin-top: 2rem;
}

.footer-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.footer-text strong {
  color: white;
  font-weight: 600;
}

/* Responsivo */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1.125rem;
  }

  .features-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .cta-section {
    padding: 2rem 1.5rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }

  .cta-description {
    font-size: 1rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 100%;
    max-width: 300px;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }
}
</style>
