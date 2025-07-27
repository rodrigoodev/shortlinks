<script setup>
// Redirecionar se já estiver logado
const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
  const authData = localStorage.getItem("authData");
  if (authData) {
    isLoggedIn.value = true;
    router.push("/editor");
  }
});

// Formulário de login
const loginForm = ref({
  slug: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

// Validação do slug (Instagram)
const validateSlug = (slug) => {
  // Remove espaços e caracteres especiais, mantém apenas letras, números e underscore
  return slug.toLowerCase().replace(/[^a-z0-9_]/g, "");
};

// Função de login
const handleLogin = async () => {
  if (!loginForm.value.slug || !loginForm.value.password) {
    error.value = "Preencha todos os campos";
    return;
  }

  // Validar formato do slug
  const cleanSlug = validateSlug(loginForm.value.slug);
  if (cleanSlug !== loginForm.value.slug.toLowerCase()) {
    error.value = "O slug deve conter apenas letras, números e underscore";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await $fetch("/api/auth", {
      method: "POST",
      body: {
        slug: cleanSlug,
        password: loginForm.value.password,
      },
    });

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
      error.value = response.message;
    }
  } catch (err) {
    error.value = "Erro ao fazer login. Tente novamente.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">Acessar Editor</h1>
        <p class="login-description">
          Digite seu Instagram e senha para acessar o editor do seu perfil
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">Instagram</label>
          <div class="input-wrapper">
            <span class="input-prefix">@</span>
            <input
              v-model="loginForm.slug"
              type="text"
              placeholder="seuinstagram"
              class="form-input"
              :class="{ error: error }"
              required
            />
          </div>
          <p class="input-help">
            Digite apenas o nome do seu Instagram (sem @)
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Senha</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="Sua senha"
            class="form-input"
            :class="{ error: error }"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? "Entrando..." : "Entrar no Editor" }}
        </button>
      </form>

      <div class="login-footer">
        <p class="footer-text">Não tem um perfil ainda?</p>
        <NuxtLink to="/" class="footer-link">
          Solicitar criação de perfil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: "Inter", sans-serif;
}

.login-container {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.login-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.error-message {
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.login-button {
  padding: 0.75rem 1rem;
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

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.login-button:disabled {
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

.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.footer-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #1d4ed8;
}

/* Responsivo */
@media (max-width: 640px) {
  .login-container {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 1.25rem;
  }

  .login-description {
    font-size: 0.8rem;
  }
}
</style>
