<template>
  <div class="hand">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="card"
      :class="{ highlight: highlight.includes(card) }"
    >
      {{ card }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  cards: Array,
  highlight: Array
})
</script>

<style scoped>
.hand { display: flex; margin-bottom: 10px; }
.card {
  border: 1px solid white;
  padding: 10px;
  margin-right: 5px;
  background: white;
  color: black;
}
.highlight {
  border: 2px solid gold;
  font-weight: bold;
}
</style>
