<template>
  <div class="container">
    <h1>Seven Card Stud - 勝敗判定付き</h1>

    <h2>CPUの手札</h2>
    <HandDisplay :cards="fullCpuHand" :hideIndices="cpuHiddenIndices" />

    <h2>あなたの手札</h2>
    <HandDisplay :cards="fullPlayerHand" />

    <button @click="nextStreet" :disabled="currentStreet >= 7">
      Next Street ({{ currentStreet }} → {{ currentStreet + 1 }})
    </button>

    <div class="result" v-if="resultText">
      <h3>勝敗結果：</h3>
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
const showAllCpuCards = ref(false) // ← 🔑 NEW


// CPUの表示制御（伏せるインデックス）
const cpuHiddenIndices = computed(() => {
  if (showAllCpuCards.value) return [] // ← すべて公開
  const indices = []
  for (let i = 0; i < 7; i++) {
    const isRevealed = (i === 2) || (i >= 3 && i < currentStreet.value)
    if (!isRevealed) indices.push(i)
  }
  if (currentStreet.value < 7) indices.push(6)
  return indices
})

function nextStreet() {
  if (currentStreet.value < 7) {
    currentStreet.value += 1
    if (currentStreet.value === 7) {
      showAllCpuCards.value = true // ← 🔑 CPU手札をすべて公開
      evaluateShowdown()
    }
  }
}

function evaluateShowdown() {
  const playerEval = evaluateHand(fullPlayerHand)
  const cpuEval = evaluateHand(fullCpuHand)

  const rankOrder = [
    'High Card', 'One Pair', 'Two Pair', 'Three of a Kind',
    'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush'
  ]

  const playerScore = rankOrder.indexOf(playerEval.rank)
  const cpuScore = rankOrder.indexOf(cpuEval.rank)

  if (playerScore > cpuScore) {
    resultText.value = `あなたの勝ち！（${playerEval.rank} vs ${cpuEval.rank}）`
  } else if (cpuScore > playerScore) {
    resultText.value = `CPUの勝ち！（${cpuEval.rank} vs ${playerEval.rank}）`
  } else {
    resultText.value = `引き分け（${playerEval.rank}）`
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
}
button {
  margin-top: 20px;
  padding: 10px 20px;
}
.result {
  margin-top: 20px;
  background: #222;
  padding: 10px;
  border: 1px solid #888;
}
</style>
