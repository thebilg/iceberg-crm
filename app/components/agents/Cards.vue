<script setup lang="ts">
import type { AgentRecord } from '~/stores/crm'
import { formatCurrency } from '~/composables/useCurrency'

defineProps<{
	agents: AgentRecord[]
}>()
</script>

<template>
	<div class="agents-grid">
		<article v-for="agent in agents" :key="agent._id" class="agent-card">
			<div class="agent-card__top">
				<div>
					<p class="agent-card__eyebrow">Danışman</p>
					<h3>{{ agent.name }}</h3>
				</div>

				<span class="agent-card__avatar">
					{{ agent.name.slice(0, 1).toUpperCase() }}
				</span>
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
