<script setup lang="ts">
import TransactionCard from '~/components/sales/TransactionCard.vue'
import type { TransactionRecord } from '~/stores/crm'
import type { TransactionStage } from '~/composables/useStages'
import { stageLabels, useStages } from '~/composables/useStages'

const props = defineProps<{
	transactions: TransactionRecord[]
}>()

const emit = defineEmits<{
	advance: [id: string]
	delete: [id: string]
	move: [payload: { id: string, stage: TransactionStage }]
}>()

const stages = useStages()
const draggingId = ref<string | null>(null)
const dropStage = ref<TransactionStage | null>(null)

const startDrag = (id: string) => {
	draggingId.value = id
}

const setDropStage = (stage: TransactionStage | null) => {
	dropStage.value = stage
}

const handleDrop = (stage: TransactionStage) => {
	if (draggingId.value) {
		emit('move', {
			id: draggingId.value,
			stage
		})
	}

	draggingId.value = null
	dropStage.value = null
}

const handleDragEnd = () => {
	draggingId.value = null
	dropStage.value = null
}

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
		<section
			v-for="column in itemsByStage"
			:key="column.stage"
			class="kanban-column"
			:class="{ 'kanban-column--active': dropStage === column.stage }"
		>
			<header class="kanban-column__header">
				<div>
					<p class="kanban-column__eyebrow">Aşama</p>
					<h2>{{ column.label }}</h2>
				</div>

				<span class="kanban-column__count">{{ column.items.length }}</span>
			</header>

			<div
				class="kanban-column__body"
				@dragenter.prevent="setDropStage(column.stage)"
				@dragover.prevent="setDropStage(column.stage)"
				@dragleave="setDropStage(dropStage === column.stage ? null : dropStage)"
				@drop.prevent="handleDrop(column.stage)"
			>
				<TransactionCard
					v-for="transaction in column.items"
					:key="transaction._id"
					:transaction="transaction"
					@advance="emit('advance', $event)"
					@delete="emit('delete', $event)"
					@dragstart="startDrag"
					@dragend="handleDragEnd"
				/>

				<p v-if="!column.items.length" class="kanban-column__empty">
					Bu aşamada kayıt yok.
				</p>
			</div>
		</section>
	</div>
</template>
