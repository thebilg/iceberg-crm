<script setup lang="ts">
import type { TransactionRecord } from '~/stores/crm'
import { stageLabels, getNextStage } from '~/composables/useStages'
import { formatCurrency } from '~/composables/useCurrency'

const props = defineProps<{
	transaction: TransactionRecord
}>()

defineEmits<{
	advance: [id: string]
}>()

const nextStage = computed(() => getNextStage(props.transaction.stage))
</script>

<template>
	<article class="transaction-card">
		<div class="transaction-card__header">
			<div>
				<p class="transaction-card__eyebrow">{{ transaction.propertyId?.city || 'Portföy' }}</p>
				<h3>{{ transaction.propertyId?.title || 'Bilinmeyen ilan' }}</h3>
			</div>

			<strong>{{ formatCurrency(transaction.price) }}</strong>
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

		<div v-if="transaction.commission" class="transaction-card__commission">
			<span>Ajans: {{ formatCurrency(transaction.commission.agency) }}</span>
			<span>Listeleyen: {{ formatCurrency(transaction.commission.listingAgent) }}</span>
			<span>Satan: {{ formatCurrency(transaction.commission.sellingAgent) }}</span>
		</div>

		<button
			v-if="nextStage"
			type="button"
			class="transaction-card__action"
			@click="$emit('advance', transaction._id)"
		>
			Sonraki adım: {{ stageLabels[nextStage] }}
		</button>

		<div v-else class="transaction-card__done">
			İşlem tamamlandı
		</div>
	</article>
</template>
