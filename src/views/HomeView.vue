<script setup>
import { useAuthStore } from '../stores/authStore' 
const authStore = useAuthStore()                     
</script>

<template>
  <section class="card">
    <h1>Bem-vindo ao Meus Jogos</h1>
    <p class="muted">Registre seus jogos e avaliações.</p>
    <p v-if="!authStore.user" class="actions">Faca login para começar a adicionar jogos na sua lista.</p>

    <div v-if="!authStore.user" class="actions">
      <router-link to="/login">
        <button>Fazer login</button>
      </router-link>
    </div>
  </section>
</template>