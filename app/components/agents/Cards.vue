<script setup lang="ts">
import type { AgentRecord } from '~/stores/crm'
import { formatCurrency } from '~/composables/useCurrency'

defineProps<{
	agents: AgentRecord[]
}>()

defineEmits<{
	delete: [id: string]
}>()
</script>

<template>
	<div class="agents-grid">
		<article v-for="agent in agents" :key="agent._id" class="agent-card">
			<button type="button" class="record-delete record-delete--floating" aria-label="Kaydı sil" @click="$emit('delete', agent._id)">
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

			<div class="agent-card__top">
				<div>
					<p class="agent-card__eyebrow">Danışman</p>
					<h3>{{ agent.name }}</h3>
				</div>
			</div>

			<dl class="agent-card__meta">
				<div>
					<dt>E-posta</dt>
					<dd>{{ agent.email }}</dd>
				</div>

				<div>
					<dt>Telefon</dt>
					<dd>{{ agent.phone }}</dd>
				</div>
			</dl>

			<div class="agent-card__earnings">
				<span>Toplam kazanç</span>
				<strong>{{ formatCurrency(agent.totalEarnings) }}</strong>
			</div>
		</article>
	</div>
</template>
