<template>
  <div class="container">
    <h1>Seven Card Stud（Vue版）</h1>

    <h2>CPUの手札</h2>
    <HandDisplay :cards="cpuHand" :highlight="cpuBestFive" />

    <h2>あなたの手札</h2>
    <HandDisplay :cards="playerHand" :highlight="playerBestFive" />

    <ActionPanel @action="handlePlayerAction" />

    <div class="log">
      <p v-for="(msg, idx) in log" :key="idx">{{ msg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { evaluateHand } from './utils/evaluateHand'
import HandDisplay from './components/HandDisplay.vue'
import ActionPanel from './components/ActionPanel.vue'

const deck = ref(shuffle(generateDeck()))
const cpuHand = ref(deck.value.splice(0, 7))
const playerHand = ref(deck.value.splice(0, 7))

const cpuEval = evaluateHand(cpuHand.value)
const playerEval = evaluateHand(playerHand.value)

const cpuBestFive = cpuEval.bestFive
const playerBestFive = playerEval.bestFive

const log = ref([
  `CPU: ${cpuEval.rank}`,
  `You: ${playerEval.rank}`
])

function handlePlayerAction(action) {
  log.value.push(`You chose: ${action}`)
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
  return array
}
</script>

<style scoped>
.container { font-family: sans-serif; padding: 20px; background: #132020; color: white; }
.log { margin-top: 20px; }
</style>
