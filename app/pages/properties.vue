<script setup lang="ts">
import Fab from '~/components/ui/Fab.vue'
import PropertiesTable from '~/components/properties/Table.vue'

const api = useApi()
const store = useCrmStore()

await store.load(api)

const showCreate = ref(false)
const form = reactive({
  title: '',
  city: '',
  price: 0,
  listedBy: ''
})

const submit = async () => {
  await store.createProperty(api, {
    title: form.title,
    city: form.city,
    price: form.price,
    listedBy: form.listedBy
  })

  form.title = ''
  form.city = ''
  form.price = 0
  form.listedBy = ''
  showCreate.value = false
}
</script>

<template>
  <section class="page-shell">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">Portföy listesi</p>
        <h1>Evler</h1>
        <p class="page-header__description">
          Tüm portföyü tek listede gör, durumu izle ve yeni evleri tek tuşla ekle.
        </p>
      </div>

      <div class="page-stat">
        <span>Toplam ilan</span>
        <strong>{{ store.properties.length }}</strong>
      </div>
    </header>

    <div v-if="store.notice" class="notice-banner">
      {{ store.notice }}
    </div>

    <PropertiesTable :properties="store.properties" />

    <Fab label="Yeni ev" @click="showCreate = true" />

    <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
      <div class="modal-card">
        <div class="modal-card__header">
          <div>
            <p class="page-header__eyebrow">Oluştur</p>
            <h2>Yeni ev ekle</h2>
          </div>

          <button type="button" class="modal-card__close" @click="showCreate = false">Kapat</button>
        </div>

        <form class="form-grid" @submit.prevent="submit">
          <label>
            <span>Başlık</span>
            <input v-model="form.title" required placeholder="Deniz manzaralı rezidans" />
          </label>

          <label>
            <span>Şehir</span>
            <input v-model="form.city" required placeholder="İstanbul" />
          </label>

          <label>
            <span>Fiyat</span>
            <input v-model.number="form.price" required min="1" type="number" placeholder="450000" />
          </label>

          <label>
            <span>Danışman</span>
            <select v-model="form.listedBy" required>
              <option disabled value="">Danışman seçin</option>
              <option v-for="agent in store.agents" :key="agent._id" :value="agent._id">
                {{ agent.name }}
              </option>
            </select>
          </label>

          <button type="submit" class="form-submit">Evi oluştur</button>
        </form>
      </div>
    </div>
  </section>
</template>