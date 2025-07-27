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

// Estados do modal
const {
  showModal,
  isRegistering,
  isLoggingIn,
  closeModal,
  switchToLogin,
  switchToRegister,
} = useModal();

// Formulário de registro
const registerForm = ref({
  name: "",
  slug: "",
  password: "",
  email: "",
  description: "",
});

// Formulário de login
const loginForm = ref({
  slug: "",
  password: "",
});

// Estados de feedback
const loading = ref(false);
const message = ref("");
const success = ref(false);
const error = ref("");

// Preview do link
const previewLink = computed(() => {
  if (registerForm.value.slug) {
    const cleanSlug = registerForm.value.slug
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    return `${window.location.origin}/${cleanSlug}`;
  }
  return "";
});

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

  try {
    const response = await $fetch(`/api/profile/${cleanSlug}`);

    // Se success é true, significa que o perfil existe (não disponível)
    // Se success é false, significa que o perfil não existe (disponível)
    if (response.success) {
      return { available: false, message: "Este Shortlinks já está em uso" };
    } else {
      return { available: true, message: "Shortlinks disponível!" };
    }
  } catch (error) {
    // Em caso de erro na requisição, consideramos como disponível
    return { available: true, message: "Shortlinks disponível!" };
  }
};

// Slug availability state
const slugStatus = ref({ available: false, message: "" });

// Watch slug changes
watch(
  () => registerForm.value.slug,
  async (newSlug) => {
    if (newSlug) {
      slugStatus.value = await checkSlugAvailability(newSlug);
    } else {
      slugStatus.value = { available: false, message: "" };
    }
  },
  { debounce: 500 }
);

const handleCloseModal = () => {
  closeModal();
  registerForm.value = {
    name: "",
    slug: "",
    password: "",
    email: "",
    description: "",
  };
  loginForm.value = { slug: "", password: "" };
  message.value = "";
  success.value = false;
  error.value = "";
  slugStatus.value = { available: false, message: "" };
};

const handleRegister = async () => {
  // Validações
  if (
    !registerForm.value.name ||
    !registerForm.value.slug ||
    !registerForm.value.password
  ) {
    error.value = "Preencha todos os campos obrigatórios";
    return;
  }

  if (!slugStatus.value.available) {
    error.value = "Escolha um Instagram disponível";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const cleanSlug = validateSlug(registerForm.value.slug);

    const response = await fetch("/api/profile/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerForm.value.name,
        slug: cleanSlug,
        password: registerForm.value.password,
        email: registerForm.value.email,
        description: registerForm.value.description,
      }),
    }).then((res) => res.json());

    if (response.success) {
      success.value = true;
      message.value = `✅ Perfil criado com sucesso! 
      
🎉 Sua página estará disponível em:
${previewLink.value}

🔐 Use seu Instagram e senha para acessar o editor:
Instagram: @${cleanSlug}
Senha: ${registerForm.value.password}

📱 Sua página será assim:`;

      // Simular redirecionamento após 5 segundos
      setTimeout(() => {
        router.push(`/${cleanSlug}`);
      }, 5000);
    } else {
      success.value = false;
      message.value = response.message;
    }
  } catch (err) {
    success.value = false;
    message.value = "Erro ao criar perfil. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

const handleLogin = async () => {
  if (!loginForm.value.slug || !loginForm.value.password) {
    error.value = "Preencha todos os campos";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const cleanSlug = validateSlug(loginForm.value.slug);

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: cleanSlug,
        password: loginForm.value.password,
      }),
    }).then((res) => res.json());

    if (response.success) {
      // Salvar dados de autenticação
      localStorage.setItem(
        "authData",
        JSON.stringify({
          profile: response.profile,
          timestamp: Date.now(),
        })
      );

      // Redirecionar para o editor
      router.push("/editor");
    } else {
      success.value = false;
      message.value = response.message;
    }
  } catch (err) {
    success.value = false;
    message.value = "Erro ao fazer login. Tente novamente.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- Modal de Registro/Login -->
  <div v-if="showModal" class="modal-overlay" @click="handleCloseModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          {{ isRegistering ? "Criar minha página" : "Acessar minha página" }}
        </h3>
        <button @click="handleCloseModal" class="modal-close">
          <span>×</span>
        </button>
      </div>

      <!-- Preview do link -->
      <div v-if="isRegistering && previewLink" class="link-preview">
        <h4 class="preview-title">Sua página ficará assim:</h4>
        <div class="preview-url">
          <span class="preview-label">Link:</span>
          <span class="preview-value">{{ previewLink }}</span>
        </div>
        <div
          class="preview-status"
          :class="slugStatus.available ? 'available' : 'unavailable'"
        >
          {{ slugStatus.message }}
        </div>
      </div>

      <!-- Formulário de Registro -->
      <form
        v-if="isRegistering"
        @submit.prevent="handleRegister"
        class="modal-form"
      >
        <div class="form-group">
          <label class="form-label">Nome completo *</label>
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="João Silva"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Instagram *</label>
          <div class="input-wrapper">
            <span class="input-prefix">@</span>
            <input
              v-model="registerForm.slug"
              type="text"
              placeholder="joaosilva"
              class="form-input"
              :class="{ error: !slugStatus.available && registerForm.slug }"
              required
            />
          </div>
          <p class="input-help">
            Digite apenas o nome do seu Instagram (sem @)
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Senha *</label>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="Sua senha"
            class="form-input"
            required
          />
          <p class="input-help">
            Use esta senha para acessar o editor da sua página
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Email (opcional)</label>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="seu@email.com"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Descrição (opcional)</label>
          <textarea
            v-model="registerForm.description"
            placeholder="Uma breve descrição sobre você"
            class="form-input"
            rows="2"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="loading || !slugStatus.available"
          class="modal-button"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? "Criando..." : "Criar minha página!" }}
        </button>

        <div class="form-switch">
          <p class="switch-text">
            Já tem uma página?
            <button type="button" @click="switchToLogin" class="switch-link">
              Fazer login
            </button>
          </p>
        </div>
      </form>

      <!-- Formulário de Login -->
      <form v-if="isLoggingIn" @submit.prevent="handleLogin" class="modal-form">
        <div class="form-group">
          <label class="form-label">Instagram</label>
          <div class="input-wrapper">
            <span class="input-prefix">@</span>
            <input
              v-model="loginForm.slug"
              type="text"
              placeholder="joaosilva"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Senha</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="Sua senha"
            class="form-input"
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="modal-button">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? "Entrando..." : "Acessar editor" }}
        </button>

        <div class="form-switch">
          <p class="switch-text">
            Não tem uma página?
            <button type="button" @click="switchToRegister" class="switch-link">
              Criar agora
            </button>
          </p>
        </div>
      </form>

      <!-- Mensagens -->
      <div
        v-if="message"
        class="modal-message"
        :class="success ? 'success' : 'error'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal */
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
  max-width: 500px;
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
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: #f3f4f6;
}

/* Link Preview */
.link-preview {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.preview-url {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.preview-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.preview-value {
  font-family: "Monaco", "Menlo", monospace;
  font-size: 0.875rem;
  color: #2563eb;
  font-weight: 600;
  background: #eff6ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.preview-status {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.preview-status.available {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.preview-status.unavailable {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Formulário */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  padding-left: 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  resize: vertical;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-input.error {
  border-color: #dc2626;
}

.input-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.modal-button {
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.modal-button:disabled {
  opacity: 0.6;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.form-switch {
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.switch-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.switch-link {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.switch-link:hover {
  color: #1d4ed8;
}

.modal-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-line;
}

.modal-message.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #16a34a;
}

.modal-message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsivo */
@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }
}
</style>
