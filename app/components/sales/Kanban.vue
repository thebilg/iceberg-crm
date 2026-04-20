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
const dragging = ref<{ id: string, nextStage: TransactionStage | null } | null>(null)
const dropStage = ref<TransactionStage | null>(null)

const isAllowedDrop = (stage: TransactionStage) => dragging.value?.nextStage === stage

const startDrag = (payload: { id: string, nextStage: string | null }) => {
	dragging.value = {
		id: payload.id,
		nextStage: payload.nextStage as TransactionStage | null
	}
}

const setDropStage = (stage: TransactionStage | null) => {
	dropStage.value = stage && isAllowedDrop(stage) ? stage : null
}

const handleDrop = (stage: TransactionStage) => {
	if (dragging.value?.id && isAllowedDrop(stage)) {
		emit('move', {
			id: dragging.value.id,
			stage
		})
	}

	dragging.value = null
	dropStage.value = null
}

const handleDragEnd = () => {
	dragging.value = null
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
	<div class="kanban-grid" :class="{ 'kanban-grid--dragging': Boolean(dragging) }">
		<section
			v-for="column in itemsByStage"
			:key="column.stage"
			class="kanban-column"
			:class="{
				'kanban-column--active': dropStage === column.stage,
				'kanban-column--enabled': isAllowedDrop(column.stage)
			}"
			@dragenter.prevent="setDropStage(column.stage)"
			@dragover.prevent="setDropStage(column.stage)"
			@dragleave="setDropStage(dropStage === column.stage ? null : dropStage)"
			@drop.prevent="handleDrop(column.stage)"
		>
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
