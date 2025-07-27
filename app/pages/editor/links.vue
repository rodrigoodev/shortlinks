<script setup>
// Middleware de autenticação
definePageMeta({
  middleware: ["auth"],
});

// Buscar dados do profile para o profile_id
const { data: page } = await useFetch("/api/hello");

// Computed para obter o profile_id
const profileId = computed(() => {
  const id = page.value?.profile?.id || 1;
  return id;
});
</script>

<template>
  <div class="editor-links-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="back-link">
          <NuxtLink to="/editor" class="back-button">
            ← Voltar ao Editor
          </NuxtLink>
        </div>
        <h1 class="page-title">Gerenciar Links</h1>
        <p class="page-description">
          Crie, edite e organize os links do seu perfil
        </p>
      </div>

      <!-- Conteúdo Principal -->
      <div class="main-content">
        <LinkManager :profile-id="profileId" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout principal */
.editor-links-page {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 0.75rem;
}

.container {
  max-width: 56rem;
  margin: 0 auto;
}

/* Header */
.header {
  margin-bottom: 1rem;
}

.back-link {
  margin-bottom: 0.75rem;
}

.back-button {
  color: #2563eb;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #1d4ed8;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #4b5563;
  font-size: 0.875rem;
}

/* Conteúdo principal */
.main-content {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  padding: 1rem;
}

/* Responsivo */
@media (min-width: 640px) {
  .editor-links-page {
    padding: 1.5rem;
  }

  .header {
    margin-bottom: 2rem;
  }

  .back-link {
    margin-bottom: 1rem;
  }

  .back-button {
    font-size: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .main-content {
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .page-title {
    font-size: 1.875rem;
  }

  .main-content {
    padding: 2rem;
  }
}
</style>
