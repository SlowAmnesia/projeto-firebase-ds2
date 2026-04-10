// router/index.js — Configuracao das rotas da aplicacao

import { createRouter, createWebHashHistory } from 'vue-router'
import { auth } from '../firebase/config'

import HomeView      from '../views/HomeView.vue'
import LoginView     from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView   from '../views/ProfileView.vue'


// ---------------------------------------------------------------------------
// DEFINICAO DAS ROTAS
// ---------------------------------------------------------------------------
const routes = [

  // Pagina inicial — publica, qualquer um pode ver
  {
    path: '/',
    component: HomeView
  },

  // Pagina de login — unica rota publica
  {
    path: '/login',
    component: LoginView
  },

  // Lista de jogos — protegida
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },

  // Perfil do usuario — protegida
  {
    path: '/profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  }

]


// ---------------------------------------------------------------------------
// CRIACAO DO ROUTER
// ---------------------------------------------------------------------------
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router


// ---------------------------------------------------------------------------
// NAVIGATION GUARD — controle de acesso
// ---------------------------------------------------------------------------
// Executado antes de cada mudanca de rota
router.beforeEach((to, from, next) => {

  // Verifica se a rota exige autenticacao
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Verifica se ha usuario logado no Firebase
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    // Rota protegida + sem login = redireciona para o login
    next('/login')
  } else {
    // Tudo certo, deixa passar
    next()
  }

})
