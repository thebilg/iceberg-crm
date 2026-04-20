<script setup lang="ts">
import TransactionCard from '~/components/sales/TransactionCard.vue'
import type { TransactionRecord } from '~/stores/crm'
import { stageLabels, useStages } from '~/composables/useStages'

const props = defineProps<{
	transactions: TransactionRecord[]
}>()

defineEmits<{
	advance: [id: string]
}>()

const stages = useStages()

const itemsByStage = computed(() => {
	return stages.map(stage => ({
		stage,
		label: stageLabels[stage],
		items: props.transactions.filter(transaction => transaction.stage === stage)
	}))
})
</script>

<template>
	<div class="kanban-grid">
		<section v-for="column in itemsByStage" :key="column.stage" class="kanban-column">
			<header class="kanban-column__header">
				<div>
					<p class="kanban-column__eyebrow">Aşama</p>
					<h2>{{ column.label }}</h2>
				</div>

				<span class="kanban-column__count">{{ column.items.length }}</span>
			</header>

			<div class="kanban-column__body">
				<TransactionCard
					v-for="transaction in column.items"
					:key="transaction._id"
					:transaction="transaction"
					@advance="$emit('advance', $event)"
				/>

				<p v-if="!column.items.length" class="kanban-column__empty">
					Bu aşamada kayıt yok.
				</p>
			</div>
		</section>
	</div>
</template>
