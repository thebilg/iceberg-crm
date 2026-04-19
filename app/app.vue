<template>
  <div class="flex min-h-screen bg-gray-50">
    
    <!-- SIDEBAR -->
    <aside class="w-64 bg-white border-r p-4">
      <h1 class="text-xl font-bold mb-6 text-purple-600">CRM</h1>

      <nav class="flex flex-col gap-2">
        <NuxtLink
          to="/"
          class="p-2 rounded hover:bg-purple-50"
          active-class="bg-purple-100 text-purple-700 font-semibold"
        >
          🏠 Evler
        </NuxtLink>

        <NuxtLink
          to="/agents"
          class="p-2 rounded hover:bg-purple-50"
          active-class="bg-purple-100 text-purple-700 font-semibold"
        >
          👤 Danışmanlar
        </NuxtLink>

        <NuxtLink
          to="/sales"
          class="p-2 rounded hover:bg-purple-50"
          active-class="bg-purple-100 text-purple-700 font-semibold"
        >
          💰 Satışlar
        </NuxtLink>
      </nav>
    </aside>

    <!-- CONTENT -->
    <main class="flex-1 p-6">
      <NuxtPage />
    </main>

    <!-- FLOATING ADD BUTTON -->
    <button
      class="fixed bottom-6 right-6 bg-purple-600 text-white w-14 h-14 rounded-full text-2xl shadow-lg"
    >
      +
    </button>

  </div>
</template>