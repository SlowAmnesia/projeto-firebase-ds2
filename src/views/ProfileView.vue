<script setup>
/**
 * ProfileView.vue — Perfil do usuario
 *
 * Exibe o email do usuario logado e um botao de logout.
 * Rota protegida: so acessivel com login.
 */

import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router    = useRouter()

// Faz o logout e redireciona para a tela de login
const sair = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <section class="card">
    <h1>Perfil</h1>
    <p class="muted">Informações da sua conta.</p>

    <div class="field">
      <label>Email</label>
      <!-- Exibe o email do usuario logado vindo da store -->
      <p>{{ authStore.user?.email }}</p>
    </div>

    <div class="actions">
      <!-- Chama a funcao sair() que faz logout e redireciona -->
      <button @click="sair">Sair da conta</button>
    </div>
  </section>
</template>
