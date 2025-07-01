<template>
  <div class="container">
    <h1>Seven Card Stud - ベット付き</h1>

    <div class="board">
      <div class="player-row">
        <h3>{{ cpu.name }}（{{ cpu.stack }} チップ）</h3>
        <HandDisplay :cards="cpu.hand" :hideIndices="cpuHiddenIndices" :highlight="cpu.bestFive" />
      </div>

      <div class="player-row">
        <h3>{{ player.name }}（{{ player.stack }} チップ）</h3>
        <HandDisplay :cards="player.hand" :hideIndices="playerHiddenIndices" :highlight="player.bestFive" />
      </div>
    </div>

    <div class="actions" v-if="!showResult && currentStreet < 7">
      <button @click="playerAction('call')">Call</button>
      <button @click="playerAction('raise')">Raise</button>
      <button @click="playerAction('fold')">Fold</button>
    </div>

    <button @click="nextStreet" :disabled="currentStreet >= 7 || showResult">
      Next Street
    </button>

    <div class="result" v-if="resultText">
      <h3>ショーダウン！</h3>
      <p>{{ resultText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HandDisplay from './components/HandDisplay.vue'
import { evaluateHand } from './utils/evaluateHand.js'

function generateDeck() {
  const suits = ['♠','♥','♦','♣']
  const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
  return suits.flatMap(suit => ranks.map(rank => suit + rank))
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const deck = ref(generateDeck())
shuffle(deck.value)

const player = ref({
  name: 'あなた',
  hand: deck.value.splice(0, 7),
  stack: 100,
  bestFive: []
})
const cpu = ref({
  name: 'CPU',
  hand: deck.value.splice(0, 7),
  stack: 100,
  bestFive: []
})

const currentStreet = ref(3)
const resultText = ref('')
const showAllCpuCards = ref(false)
const showResult = ref(false)
let pot = ref(0)

const cpuHiddenIndices = computed(() => {
  if (showAllCpuCards.value) return []
  const indices = []
  for (let i = 0; i < 7; i++) {
    const isRevealed = (i === 2) || (i >= 3 && i < currentStreet.value)
    if (!isRevealed) indices.push(i)
  }
  if (currentStreet.value < 7) indices.push(6)
  return indices
})

const playerHiddenIndices = computed(() => {
  const indices = []
  for (let i = 0; i < 7; i++) {
    if (i >= currentStreet.value) indices.push(i)
  }
  return indices
})

function nextStreet() {
  if (currentStreet.value < 7) {
    currentStreet.value += 1
    if (currentStreet.value === 7) {
      showAllCpuCards.value = true
      evaluateShowdown()
    }
  }
}

function playerAction(action) {
  if (action === 'fold') {
    resultText.value = 'あなたがフォールドしました。CPUの勝ち！'
    showAllCpuCards.value = true
    showResult.value = true
    return
  }

  if (action === 'raise') {
    player.value.stack -= 10
    pot.value += 10
    cpuAction('raise')
  } else if (action === 'call') {
    player.value.stack -= 5
    pot.value += 5
    cpuAction('call')
  }
}

function cpuAction(actionType) {
  const choice = Math.random()
  if (choice < 0.1) {
    resultText.value = 'CPUがフォールドしました。あなたの勝ち！'
    showResult.value = true
    showAllCpuCards.value = true
    return
  } else {
    cpu.value.stack -= 5
    pot.value += 5
  }
}

function evaluateShowdown() {
  const playerEval = evaluateHand(player.value.hand)
  const cpuEval = evaluateHand(cpu.value.hand)

  player.value.bestFive = playerEval.bestFive
  cpu.value.bestFive = cpuEval.bestFive

  const rankOrder = [
    'High Card', 'One Pair', 'Two Pair', 'Three of a Kind',
    'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush'
  ]

  const playerScore = rankOrder.indexOf(playerEval.rank)
  const cpuScore = rankOrder.indexOf(cpuEval.rank)

  const detail = (hand) => `${hand.rank}${hand.detail ? ' (' + hand.detail + ')' : ''}`

  if (playerScore > cpuScore) {
    resultText.value = `あなたの勝ち！ ${detail(playerEval)} vs ${detail(cpuEval)}`
  } else if (cpuScore > playerScore) {
    resultText.value = `CPUの勝ち！ ${detail(cpuEval)} vs ${detail(playerEval)}`
  } else {
    resultText.value = `引き分け（${detail(playerEval)}）`
  }
  showResult.value = true
}
</script>

<style scoped>
.container {
  font-family: sans-serif;
  padding: 20px;
  background: #1d1f20;
  color: white;
  text-align: center;
}
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.player-row {
  margin: 10px 0;
}
.actions {
  margin: 10px 0;
}
button {
  margin: 5px;
  padding: 10px 20px;
}
.result {
  margin-top: 20px;
  background: #222;
  padding: 10px;
  border: 1px solid #888;
}
</style>
