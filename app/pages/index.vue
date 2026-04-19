<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Evler</h1>

    <div class="grid gap-4">
      <div
        v-for="i in 5"
        :key="i"
        class="p-4 bg-white rounded shadow flex justify-between"
      >
        <div>
          <p class="font-semibold">Villa {{ i }}</p>
          <p class="text-sm text-gray-500">İstanbul</p>
        </div>

        <div class="font-bold text-purple-600">
          $450.000
        </div>
      </div>
    </div>
  </div>
</template>