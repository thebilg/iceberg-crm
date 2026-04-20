<script setup lang="ts">
import SalesKanban from '~/components/sales/Kanban.vue'
import Fab from '~/components/ui/Fab.vue'
import { formatCurrency } from '~/composables/useCurrency'

const api = useApi()
const store = useCrmStore()

await store.load(api)

const showCreate = ref(false)
const form = reactive({
  propertyId: '',
  listingAgentId: '',
  sellingAgentId: ''
})

const selectedProperty = computed(() => store.properties.find(property => property._id === form.propertyId) || null)
const transactionAmount = computed(() => selectedProperty.value?.price || 0)
const autoListingAgent = computed(() => selectedProperty.value?.listedBy || null)
const autoListingAgentName = computed(() => autoListingAgent.value?.name || '')

watch(selectedProperty, property => {
  form.listingAgentId = property?.listedBy?._id || ''
}, { immediate: true })

const submit = async () => {
  await store.createTransaction(api, {
    propertyId: form.propertyId,
    listingAgentId: form.listingAgentId,
    sellingAgentId: form.sellingAgentId,
    price: transactionAmount.value
  })

  form.propertyId = ''
  form.listingAgentId = ''
  form.sellingAgentId = ''
  showCreate.value = false
}
</script>

<template>
  <section class="page-shell">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">Satış panosu</p>
        <h1>Satışlar</h1>
        <p class="page-header__description">
          Anlaşmadan tamamlanmaya kadar tüm satışları kanban üzerinden yönet ve komisyon dağılımını gör.
        </p>
      </div>

      <div class="page-stat">
        <span>Toplam işlem</span>
        <strong>{{ store.transactions.length }}</strong>
      </div>
    </header>

    <div v-if="store.notice" class="notice-banner">
      {{ store.notice }}
    </div>

    <SalesKanban
      :transactions="store.transactions"
      @advance="store.advanceTransaction(api, $event)"
      @delete="store.deleteTransaction(api, $event)"
      @move="store.setTransactionStage(api, $event.id, $event.stage)"
    />

    <Fab label="Yeni satış" @click="showCreate = true" />

    <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
      <div class="modal-card">
        <div class="modal-card__header">
          <div>
            <p class="page-header__eyebrow">Oluştur</p>
            <h2>Yeni satış ekle</h2>
          </div>

          <button type="button" class="modal-card__close" @click="showCreate = false">Kapat</button>
        </div>

        <form class="form-grid" @submit.prevent="submit">
          <label>
            <span>Ev</span>
            <select v-model="form.propertyId" required>
              <option disabled value="">Ev seçin</option>
              <option v-for="property in store.properties" :key="property._id" :value="property._id">
                {{ property.title }}
              </option>
            </select>
          </label>

          <label>
            <span>Listeleyen danışman</span>
            <input
              :value="autoListingAgentName"
              readonly
              placeholder="Ev seçildiğinde otomatik gelir"
            />
          </label>

          <label>
            <span>Satışı yapan danışman</span>
            <select v-model="form.sellingAgentId" required>
              <option disabled value="">Danışman seçin</option>
              <option v-for="agent in store.agents" :key="agent._id" :value="agent._id">
                {{ agent.name }}
              </option>
            </select>
          </label>

          <label>
            <span>Ev tutarı</span>
            <input :value="transactionAmount ? formatCurrency(transactionAmount) : ''" readonly placeholder="Ev seçildiğinde otomatik gelir" />
          </label>

          <button type="submit" class="form-submit">Satışı oluştur</button>
        </form>
      </div>
    </div>
  </section>
</template>