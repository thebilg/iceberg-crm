<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Danışmanlar</h1>

    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white p-4 rounded shadow"
      >
        <div class="font-semibold">Agent {{ i }}</div>
        <div class="text-sm text-gray-500">agent@email.com</div>

        <div class="mt-2 text-purple-600 font-bold">
          $12.000
        </div>
      </div>
    </div>
  </div>
</template>