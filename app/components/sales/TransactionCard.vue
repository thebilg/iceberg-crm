<script setup lang="ts">
import type { TransactionRecord } from '~/stores/crm'
import { stageLabels, getNextStage } from '~/composables/useStages'

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
				<p class="transaction-card__eyebrow">{{ transaction.propertyId?.city || 'Portfoy' }}</p>
				<h3>{{ transaction.propertyId?.title || 'Bilinmeyen ilan' }}</h3>
			</div>

			<strong>${{ transaction.price.toLocaleString('en-US') }}</strong>
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
			<span>Ajans: ${{ transaction.commission.agency.toLocaleString('en-US') }}</span>
			<span>Listeleyen: ${{ transaction.commission.listingAgent.toLocaleString('en-US') }}</span>
			<span>Satan: ${{ transaction.commission.sellingAgent.toLocaleString('en-US') }}</span>
		</div>

		<button
			v-if="nextStage"
			type="button"
			class="transaction-card__action"
			@click="$emit('advance', transaction._id)"
		>
			Sonraki adim: {{ stageLabels[nextStage] }}
		</button>

		<div v-else class="transaction-card__done">
			Islem tamamlandi
		</div>
	</article>
</template>
