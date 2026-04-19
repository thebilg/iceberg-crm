<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Satışlar</h1>

    <div class="grid grid-cols-4 gap-4">

      <div v-for="stage in stages" :key="stage" class="bg-gray-100 p-3 rounded">
        <h2 class="font-semibold mb-2">{{ stage }}</h2>

        <div
          v-for="i in 2"
          :key="i"
          class="bg-white p-3 rounded mb-2 shadow"
        >
          Sale {{ i }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const stages = [
  'agreement',
  'earnest_money',
  'title_deed',
  'completed'
]
</script>