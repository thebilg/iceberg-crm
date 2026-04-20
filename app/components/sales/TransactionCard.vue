<script setup lang="ts">
import type { TransactionRecord } from '~/stores/crm'
import { stageLabels, getNextStage } from '~/composables/useStages'
import { formatCurrency } from '~/composables/useCurrency'

const props = defineProps<{
	transaction: TransactionRecord
}>()

defineEmits<{
	advance: [id: string]
	delete: [id: string]
	dragstart: [payload: { id: string, nextStage: string | null }]
	dragend: []
}>()

const nextStage = computed(() => getNextStage(props.transaction.stage))
const sameAgentHandlesBothSides = computed(() => {
	return Boolean(
		props.transaction.listingAgentId &&
		props.transaction.sellingAgentId &&
		props.transaction.listingAgentId._id === props.transaction.sellingAgentId._id
	)
})
const isDragging = ref(false)

const handleDragStart = (event: DragEvent) => {
	isDragging.value = true
	event.dataTransfer?.setData('text/plain', props.transaction._id)
	event.dataTransfer?.setDragImage(event.currentTarget as HTMLElement, 32, 20)
	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = 'move'
	}
}

const handleDragEnd = () => {
	isDragging.value = false
}
</script>

<template>
	<article
		class="transaction-card"
		:class="{ 'transaction-card--dragging': isDragging }"
		:draggable="Boolean(nextStage)"
		@dragstart="handleDragStart($event); $emit('dragstart', { id: transaction._id, nextStage })"
		@dragend="handleDragEnd(); $emit('dragend')"
	>
		<button type="button" class="record-delete record-delete--floating" aria-label="Kaydı sil" @click="$emit('delete', transaction._id)">
			<span class="record-delete__icon" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9">
					<path d="M9 3h6" />
					<path d="M4 7h16" />
					<path d="M6 7l1 13a1 1 0 0 0 1 .92h8a1 1 0 0 0 1-.92L18 7" />
					<path d="M10 11v6" />
					<path d="M14 11v6" />
				</svg>
			</span>
		</button>

		<div class="transaction-card__header">
			<div>
				<p class="transaction-card__eyebrow">{{ transaction.propertyId?.city || 'Portföy' }}</p>
				<h3>{{ transaction.propertyId?.title || 'Bilinmeyen ilan' }}</h3>
				<strong class="transaction-card__price">{{ formatCurrency(transaction.price) }}</strong>
			</div>
		</div>

		<dl class="transaction-card__meta">
			<div>
				<dt>Listeleyen</dt>
				<dd>{{ transaction.listingAgentId?.name || '-' }}</dd>
			</div>

			<div>
				<dt>Satan</dt>
				<dd>{{ transaction.sellingAgentId?.name || '-' }}</dd>
			</div>
		</dl>

		<div v-if="transaction.commission && transaction.stage !== 'completed'" class="transaction-card__commission">
			<p class="transaction-card__commission-title">
				Beklenen komisyon dağılımı
			</p>
			<p v-if="sameAgentHandlesBothSides" class="transaction-card__commission-note">
				Listeleyen ve satan danışman aynı kişi olduğu için toplam komisyonun %50'sini alır.
			</p>
			<span>Toplam komisyon: {{ formatCurrency(transaction.commission.total) }}</span>
			<span>Ajans payı: {{ formatCurrency(transaction.commission.agency) }}</span>
			<span v-if="sameAgentHandlesBothSides">
				Listeleyen ve satan kazancı: {{ formatCurrency(transaction.commission.listingAgent) }}
			</span>
			<template v-else>
				<span>Listeleyen kazancı: {{ formatCurrency(transaction.commission.listingAgent) }}</span>
				<span>Satan kazancı: {{ formatCurrency(transaction.commission.sellingAgent) }}</span>
			</template>
		</div>

		<button
			v-if="nextStage"
			type="button"
			class="transaction-card__action"
			@click="$emit('advance', transaction._id)"
		>
			Sonraki adım: {{ stageLabels[nextStage] }}
		</button>

		<div v-else-if="transaction.commission" class="transaction-card__settlement">
			<p class="transaction-card__settlement-title">Hesaplama tamamlandı</p>
			<p class="transaction-card__settlement-text">
				{{ formatCurrency(transaction.price) }} tutarındaki satış için sabit %5 komisyon işlendi.
			</p>
			<p v-if="sameAgentHandlesBothSides" class="transaction-card__settlement-text">
				Listeleyen ve satan danışman aynı kişi olduğu için toplam komisyonun %50'si bu danışmana yazıldı.
			</p>
			<div class="transaction-card__settlement-grid">
				<span>Ajans: {{ formatCurrency(transaction.commission.agency) }}</span>
				<span v-if="sameAgentHandlesBothSides">
					Listeleyen ve satan kazancı: {{ formatCurrency(transaction.commission.listingAgent) }}
				</span>
				<template v-else>
					<span>Listeleyen: {{ formatCurrency(transaction.commission.listingAgent) }}</span>
					<span>Satan: {{ formatCurrency(transaction.commission.sellingAgent) }}</span>
				</template>
			</div>
		</div>

		<div v-else class="transaction-card__done">
			İşlem tamamlandı
		</div>
	</article>
</template>
