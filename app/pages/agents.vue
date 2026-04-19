<script setup lang="ts">
import AgentCards from '~/components/agents/Cards.vue'
import Fab from '~/components/ui/Fab.vue'

const api = useApi()
const store = useCrmStore()

await store.load(api)

const showCreate = ref(false)
const form = reactive({
  name: '',
  email: '',
  phone: ''
})

const submit = async () => {
  await store.createAgent(api, form)
  form.name = ''
  form.email = ''
  form.phone = ''
  showCreate.value = false
}
</script>

<template>
  <section class="page-shell">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">Ekip kartlari</p>
        <h1>Danismanlar</h1>
        <p class="page-header__description">
          Tum danismanlari kart yapisinda goruntule, iletisim bilgilerini ve kazancini tek ekranda takip et.
        </p>
      </div>

      <div class="page-stat">
        <span>Aktif kisi</span>
        <strong>{{ store.agents.length }}</strong>
      </div>
    </header>

    <div v-if="store.notice" class="notice-banner">
      {{ store.notice }}
    </div>

    <AgentCards :agents="store.agents" />

    <Fab label="Yeni danisman" @click="showCreate = true" />

    <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
      <div class="modal-card">
        <div class="modal-card__header">
          <div>
            <p class="page-header__eyebrow">Olustur</p>
            <h2>Yeni danisman ekle</h2>
          </div>

          <button type="button" class="modal-card__close" @click="showCreate = false">Kapat</button>
        </div>

        <form class="form-grid" @submit.prevent="submit">
          <label>
            <span>Ad soyad</span>
            <input v-model="form.name" required placeholder="Aylin Demir" />
          </label>

          <label>
            <span>E-posta</span>
            <input v-model="form.email" required type="email" placeholder="aylin@iceberg.com" />
          </label>

          <label>
            <span>Telefon</span>
            <input v-model="form.phone" required placeholder="+90 555 000 00 00" />
          </label>

          <button type="submit" class="form-submit">Danismani olustur</button>
        </form>
      </div>
    </div>
  </section>
</template>