<template>
  <div class="hand">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="card"
    >
      {{ hideIndices.includes(index) ? '?' : card }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  cards: Array,
  hideIndices: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.hand {
  display: flex;
  margin-bottom: 10px;
}
.card {
  border: 1px solid white;
  padding: 10px;
  margin-right: 5px;
  background: white;
  color: black;
  min-width: 40px;
  text-align: center;
}
</style>
