<script setup>
/**
 * LoginView.vue — Tela de Login e Cadastro
 *
 * Propósito: permitir que o usuário faça login ou crie uma conta
 * usando e-mail e senha via Firebase Authentication.
 *
 * Conceitos demonstrados neste componente:
 *  - ref(): estado local reativo
 *  - v-model: ligação bidirecional entre input e ref
 *  - Funções assíncronas (async/await) com try/catch
 *  - Firebase Auth: signIn e createUser
 *  - Navegação programática com useRouter
 */

// "ref" cria uma variável reativa para valores simples (string, number, boolean).
// Acessamos/alteramos o valor sempre via .value no <script>.
import { ref } from 'vue'

// useRouter dá acesso ao roteador do Vue Router dentro do <script setup>.
// Usamos para navegar entre páginas via código (não por <router-link>).
import { useRouter } from 'vue-router'

// Duas funções do Firebase Authentication:
//   - createUserWithEmailAndPassword: cria uma nova conta
//   - signInWithEmailAndPassword: autentica uma conta existente
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'

// Importa a instância do Firebase já configurada no projeto.
// "auth" é o serviço de autenticação inicializado em firebase/config.js
import { auth } from '../firebase/config'

// Instância do roteador — usada para redirecionar após login/cadastro
const router = useRouter()

// --- Estado local do formulário ---
// Cada ref() abaixo corresponde a um campo ou informação da tela.
// O Vue rastreia essas variáveis e atualiza o DOM quando elas mudam.

const email = ref('')   // Valor digitado no campo de e-mail
const senha = ref('')   // Valor digitado no campo de senha
const erro  = ref('')   // Mensagem de erro exibida ao usuário (vazia = sem erro)

/**
 * entrar() — Faz login com e-mail e senha
 *
 * Fluxo:
 *  1. Limpa qualquer erro anterior
 *  2. Chama o Firebase para autenticar
 *  3. Sucesso → redireciona para /dashboard
 *  4. Falha   → exibe mensagem amigável em "erro"
 */
const entrar = async () => {
  erro.value = '' // Limpa erro antes de tentar — evita mensagem antiga na tela
  try {
    // await pausa a execução até o Firebase responder.
    // Passa a instância "auth" + os valores atuais dos campos.
    await signInWithEmailAndPassword(auth, email.value, senha.value)

    // Chegou aqui sem exceção = login OK.
    // router.push() navega para a rota sem recarregar a página.
    router.push('/dashboard')
  } catch (e) {
    // O Firebase lança um erro para credenciais inválidas, usuário inexistente etc.
    // Optamos por uma mensagem genérica para não expor detalhes ao usuário.
    erro.value = 'Nao foi possivel entrar. Verifique email e senha.'
  }
}

/**
 * registrar() — Cria uma nova conta com e-mail e senha
 *
 * Fluxo idêntico ao entrar(), mas chama createUserWithEmailAndPassword.
 * O Firebase exige senha com no mínimo 6 caracteres (validação automática).
 *
 * Após criar a conta com sucesso, o Firebase já autentica o usuário
 * automaticamente — por isso podemos ir direto ao dashboard.
 */
const registrar = async () => {
  erro.value = ''
  try {
    // Cria o usuário no Firebase Authentication.
    // Se o e-mail já existir ou a senha for fraca, o Firebase lança erro.
    await createUserWithEmailAndPassword(auth, email.value, senha.value)

    // Conta criada e usuário já autenticado — redireciona direto.
    router.push('/dashboard')
  } catch (e) {
    erro.value = 'Nao foi possivel cadastrar. Verifique os dados.'
  }
}
</script>

<template>
  <section class="card">
    <h1><i class="fa-solid fa-right-to-bracket"></i> Login</h1>
    <p class="muted">Use email e senha para testar o Firebase Auth.</p>

   
    <label class="field">
      Email
      <input v-model="email" type="email" placeholder="aluno@email.com" />
    </label>

    <label class="field">
      Senha
      <!-- type="password" faz o browser mascarar os caracteres digitados -->
      <input v-model="senha" type="password" placeholder="minimo 6 caracteres" />
    </label>

    <div class="actions">
      <!-- @click é a forma curta de v-on:click — chama entrar() ao clicar -->
      <button @click="entrar"><i class="fa-solid fa-arrow-right"></i> Entrar</button>

      <!-- Botão com estilo secundário para a ação menos prioritária -->
      <button class="secondary" @click="registrar">
        <i class="fa-solid fa-user-plus"></i> Criar conta
      </button>
    </div>

    <!--
      v-if="erro": este parágrafo só é renderizado no DOM quando
      "erro" tiver algum conteúdo (string não vazia "
    -->
    <p v-if="erro" class="error">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ erro }}
    </p>
  </section>
</template>