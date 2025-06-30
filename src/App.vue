<template>
  <div class="container">
    <h1>Seven Card Stud - 3rd Street Demo</h1>

    <h2>CPUの手札（公開1枚のみ）</h2>
    <HandDisplay :cards="cpuVisibleCards" />

    <h2>あなたの手札（2伏せ＋1公開）</h2>
    <HandDisplay :cards="playerVisibleCards" />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HandDisplay from './components/HandDisplay.vue'

const deck = ref(generateDeck())
shuffle(deck.value)

const fullPlayerHand = deck.value.splice(0, 7)
const fullCpuHand = deck.value.splice(0, 7)

const currentStreet = ref(3)

const playerVisibleCards = computed(() => {
  return fullPlayerHand.map((card, i) => {
    if (i === 0 || i === 1) return card  // 自分の伏せカードは見える
    if (i === 2) return card             // 公開1枚
    return '?'                           // それ以降は未配布
  })
})

const cpuVisibleCards = computed(() => {
  return fullCpuHand.map((card, i) => {
    if (i === 2) return card             // 公開カード
    return '?'                           // 伏せ or 未配布
  })
})

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
.container { font-family: sans-serif; padding: 20px; background: #1d1f20; color: white; }
</style>
