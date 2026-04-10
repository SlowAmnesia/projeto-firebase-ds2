<script setup>
// App raiz: aqui fica o menu e o router-view
import { computed } from 'vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()
const userEmail = computed(() => authStore.user?.email || 'Deslogado')
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <h2>🎮 Meus Jogos</h2>
      <span class="muted">{{ userEmail }}</span>
    </header>

    <nav class="menu">
      <!-- Inicio aparece sempre, logado ou nao -->
      <router-link to="/">Inicio</router-link>

      <!-- Essas opcoes so aparecem quando o usuario esta logado -->
      <router-link v-if="authStore.user" to="/dashboard">Meus Jogos</router-link>
      <router-link v-if="authStore.user" to="/profile">Perfil</router-link>

      <!-- Login so aparece quando NAO esta logado -->
      <router-link v-if="!authStore.user" to="/login">Login</router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>
