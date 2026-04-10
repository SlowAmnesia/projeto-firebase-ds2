<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

// --- Estado do formulario de cadastro ---
const nome       = ref('')
const genero     = ref('')
const nota       = ref('')
const observacao = ref('')
const aviso      = ref('')

// --- Lista de jogos vindos do Firestore ---
const jogos = ref([])

// --- Controle do detalhe ---
const jogoSelecionado = ref(null)

// --- Controle do modo de edicao ---
// Quando true, o painel de detalhe vira um formulario de edicao
const modoEdicao = ref(false)

// Campos do formulario de edicao (preenchidos ao clicar em Editar)
const editNome       = ref('')
const editGenero     = ref('')
const editNota       = ref('')
const editObservacao = ref('')

let unsubscribe = null


// ---------------------------------------------------------------------------
// FUNÇÃO: salvarJogo — CREATE
// ---------------------------------------------------------------------------
const salvarJogo = async () => {
  aviso.value = ''

  if (!nome.value || !genero.value || !nota.value) {
    aviso.value = 'Preencha nome, genero e nota.'
    return
  }

  if (nota.value < 0 || nota.value > 10) {
    aviso.value = 'A nota precisa ser entre 0 e 10.'
    return
  }

  await addDoc(collection(db, 'jogos'), {
    nome:       nome.value,
    genero:     genero.value,
    nota:       Number(nota.value),
    observacao: observacao.value,   // Pode ficar vazio, nao e obrigatorio
    userId:     auth.currentUser.uid
  })

  nome.value       = ''
  genero.value     = ''
  nota.value       = ''
  observacao.value = ''
}


// ---------------------------------------------------------------------------
// FUNCAO: ouvirJogos — READ em tempo real
// ---------------------------------------------------------------------------
const ouvirJogos = () => {
  const q = query(
    collection(db, 'jogos'),
    where('userId', '==', auth.currentUser.uid)
  )

  unsubscribe = onSnapshot(q, (snapshot) => {
    jogos.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  })
}


// ---------------------------------------------------------------------------
// FUNÇÕES DE DETALHE
// ---------------------------------------------------------------------------
const abrirDetalhe = (jogo) => {
  jogoSelecionado.value = jogo
  modoEdicao.value = false  // Garante que abre em modo visualizacao
}

const fecharDetalhe = () => {
  jogoSelecionado.value = null
  modoEdicao.value = false
}


// ---------------------------------------------------------------------------
// FUNCAO: excluirJogo — DELETE
// ---------------------------------------------------------------------------
const excluirJogo = async (id) => {
  // doc() cria uma referencia ao documento especifico pelo ID
  await deleteDoc(doc(db, 'jogos', id))
  fecharDetalhe()
}


// ---------------------------------------------------------------------------
// FUNCOES DE EDICAO — UPDATE
// ---------------------------------------------------------------------------

// Abre o modo de edicao preenchendo os campos com os dados atuais
const abrirEdicao = () => {
  editNome.value       = jogoSelecionado.value.nome
  editGenero.value     = jogoSelecionado.value.genero
  editNota.value       = jogoSelecionado.value.nota
  editObservacao.value = jogoSelecionado.value.observacao || ''
  modoEdicao.value = true
}

// Salva as alteracoes no Firestore
const salvarEdicao = async () => {
  if (!editNome.value || !editGenero.value || !editNota.value) {
    aviso.value = 'Preencha todos os campos.'
    return
  }

  // updateDoc atualiza campos especificos sem sobrescrever o documento inteiro
  await updateDoc(doc(db, 'jogos', jogoSelecionado.value.id), {
    nome:       editNome.value,
    genero:     editGenero.value,
    nota:       Number(editNota.value),
    observacao: editObservacao.value
  })

  modoEdicao.value = false
  fecharDetalhe()
}


// ---------------------------------------------------------------------------
// CICLO DE VIDA
// ---------------------------------------------------------------------------
onMounted(() => {
  if (auth.currentUser) {
    ouvirJogos()
  }
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
</script>


<template>
  <section class="card">
    <h1>Meus Jogos</h1>
    <p class="muted">Adicione os jogos que você já jogou e dê uma nota.</p>

    <!-- FORMULARIO DE CADASTRO -->
    <div class="form-row">
      <input v-model="nome"       placeholder="Nome do jogo" />
      <input v-model="genero"     placeholder="Gênero (ex: RPG)" />
      <input v-model="nota" type="number" min="0" max="10" placeholder="Nota (0-10)" />
    </div>
    <!-- Observacao fica numa linha separada porque e um campo maior -->
    <div class="form-row">
      <input
        v-model="observacao"
        placeholder="Observação (opcional) — ex: história envolvente, gráficos ótimos"
        style="grid-column: 1 / -1"
      />
      <button @click="salvarJogo">Salvar</button>
    </div>

    <p v-if="aviso" class="error">{{ aviso }}</p>

    <h3>Lista de jogos</h3>

    <!-- LISTA — mostra so nome e nota, informacao simplificada -->
    <ul v-if="jogos.length" class="lista-jogos">
      <li
        v-for="item in jogos"
        :key="item.id"
        class="item-jogo"
        @click="abrirDetalhe(item)"
      >
        <!-- Nome na esquerda, nota na direita -->
        <span>{{ item.nome }}</span>
        <span class="nota-badge">{{ item.nota }}/10</span>
      </li>
    </ul>

    <p v-else class="muted">Nenhum jogo cadastrado ainda.</p>


    <!-- PAINEL DE DETALHE -->
    <div v-if="jogoSelecionado" class="detalhe card">

      <!-- MODO VISUALIZACAO -->
      <div v-if="!modoEdicao">
        <h3>{{ jogoSelecionado.nome }}</h3>
        <p><strong>Gênero:</strong> {{ jogoSelecionado.genero }}</p>
        <p><strong>Nota:</strong> {{ jogoSelecionado.nota }} / 10</p>
        <!-- Observacao so aparece se tiver sido preenchida -->
        <p v-if="jogoSelecionado.observacao">
          <strong>Observação:</strong> {{ jogoSelecionado.observacao }}
        </p>
        <p v-else class="muted">Sem observação.</p>

        <div class="actions">
          <button @click="abrirEdicao">Editar</button>
          <button class="secondary" @click="excluirJogo(jogoSelecionado.id)">Excluir</button>
          <button class="secondary" @click="fecharDetalhe">Fechar</button>
        </div>
      </div>

      <!-- MODO EDICAO -->
      <div v-else>
        <h3>Editando jogo</h3>
        <div class="field">
          <label>Nome</label>
          <input v-model="editNome" />
        </div>
        <div class="field">
          <label>Gênero</label>
          <input v-model="editGenero" />
        </div>
        <div class="field">
          <label>Nota (0-10)</label>
          <input v-model="editNota" type="number" min="0" max="10" />
        </div>
        <div class="field">
          <label>Observação</label>
          <input v-model="editObservacao" />
        </div>
        <div class="actions">
          <button @click="salvarEdicao">Salvar</button>
          <button class="secondary" @click="modoEdicao = false">Cancelar</button>
        </div>
      </div>

    </div>

  </section>
</template>

<style scoped>
.lista-jogos {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-jogo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 6px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.item-jogo:hover {
  background-color: #1E242E;
}

.nota-badge {
  font-weight: bold;
  color: #2d4cf1;
}

.detalhe {
  margin-top: 20px;
  border: 1px solid #d9deef;
}
</style>
