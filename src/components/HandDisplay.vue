
<template>
  <div class="hand">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="card"
      :class="{
        highlight: highlight.includes(card),
        facedown: hideIndices.includes(index)
      }"
    >
      {{ hideIndices.includes(index) ? '' : card }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  cards: Array,
  hideIndices: {
    type: Array,
    default: () => []
  },
  highlight: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.hand {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.card {
  border: 1px solid white;
  padding: 10px;
  margin: 0 4px;
  background: white;
  color: black;
  min-width: 40px;
  text-align: center;
  border-radius: 5px;
}
.card.facedown {
  background: repeating-linear-gradient(
    45deg,
    #444,
    #444 5px,
    #222 5px,
    #222 10px
  );
  color: transparent;
  border: 1px solid #666;
}
.card.highlight {
  background: gold;
  font-weight: bold;
  border: 2px solid orange;
}
</style>
