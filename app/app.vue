<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue'
</script>

<template>
  <div class="app-shell">
    <div class="app-shell__glow app-shell__glow--left" />
    <div class="app-shell__glow app-shell__glow--right" />

    <Sidebar />

    <main class="app-main">
      <NuxtPage />
    </main>
  </div>
</template>