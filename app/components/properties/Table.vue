<script setup lang="ts">
import type { PropertyRecord } from '~/stores/crm'
import { formatCurrency } from '~/composables/useCurrency'

defineProps<{
	properties: PropertyRecord[]
}>()

const statusLabels: Record<string, string> = {
	available: 'Uygun',
	in_transaction: 'İşlemde',
	sold: 'Satıldı'
}
</script>

<template>
	<div class="table-shell">
		<table class="properties-table">
			<thead>
				<tr>
					<th>Başlık</th>
					<th>Şehir</th>
					<th>Fiyat</th>
					<th>Durum</th>
					<th>Danışman</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="property in properties" :key="property._id">
					<td>
						<strong>{{ property.title }}</strong>
					</td>
					<td>{{ property.city }}</td>
					<td>{{ formatCurrency(property.price) }}</td>
					<td>
						<span class="status-chip" :data-status="property.status">
							{{ statusLabels[property.status] || property.status }}
						</span>
					</td>
					<td>{{ property.listedBy?.name || '-' }}</td>
				</tr>
			</tbody>
		</table>

		<div class="properties-mobile-list">
			<article v-for="property in properties" :key="`${property._id}-mobile`" class="property-mobile-card">
				<div>
					<p class="property-mobile-card__eyebrow">{{ property.city }}</p>
					<h3>{{ property.title }}</h3>
				</div>

				<strong>{{ formatCurrency(property.price) }}</strong>
				<span class="status-chip" :data-status="property.status">
					{{ statusLabels[property.status] || property.status }}
				</span>
				<p>{{ property.listedBy?.name || 'Danışman atanamadı' }}</p>
			</article>
		</div>
	</div>
</template>
