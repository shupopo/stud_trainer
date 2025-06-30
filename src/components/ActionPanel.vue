<template>
  <div>
    <button @click="$emit('action', 'fold')">Fold</button>
    <button @click="$emit('action', 'call')">Call</button>
    <button @click="$emit('action', 'raise')">Raise</button>
  </div>
</template>

<script setup></script>

<style scoped>
button {
  padding: 10px;
  margin-right: 10px;
}
</style>
