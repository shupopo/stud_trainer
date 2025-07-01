
<template>
  <div class="container">
    <h1>Seven Card Stud - ボード表示 & 役詳細付き</h1>

    <div class="board">
      <div class="player-row">
        <h3>CPU</h3>
        <HandDisplay :cards="fullCpuHand" :hideIndices="cpuHiddenIndices" :highlight="cpuBestFive" />
      </div>

      <div class="player-row">
        <h3>あなた</h3>
        <HandDisplay :cards="fullPlayerHand" :hideIndices="playerHiddenIndices" :highlight="playerBestFive" />
      </div>
    </div>

    <button @click="nextStreet" :disabled="currentStreet >= 7">
      Next Street ({{ currentStreet }} → {{ currentStreet + 1 }})
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

const deck = ref(generateDeck())
shuffle(deck.value)

const fullPlayerHand = deck.value.splice(0, 7)
const fullCpuHand = deck.value.splice(0, 7)

const currentStreet = ref(3)
const resultText = ref('')
const showAllCpuCards = ref(false)

const playerBestFive = ref([])
const cpuBestFive = ref([])

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

function evaluateShowdown() {
  const playerEval = evaluateHand(fullPlayerHand)
  const cpuEval = evaluateHand(fullCpuHand)

  playerBestFive.value = playerEval.bestFive
  cpuBestFive.value = cpuEval.bestFive

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
}

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
button {
  margin-top: 10px;
  padding: 10px 20px;
}
.result {
  margin-top: 20px;
  background: #222;
  padding: 10px;
  border: 1px solid #888;
}
</style>
