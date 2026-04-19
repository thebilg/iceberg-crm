<script setup lang="ts">
defineProps<{
  label: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="fab" @click="$emit('click')">
    <span class="fab__icon">+</span>
    <span class="fab__label">{{ label }}</span>
  </button>
</template>