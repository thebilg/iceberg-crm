<script setup lang="ts">
import type { PropertyRecord } from '~/stores/crm'
import { formatCurrency } from '~/composables/useCurrency'

defineProps<{
	properties: PropertyRecord[]
}>()

defineEmits<{
	delete: [id: string]
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
					<th aria-label="Sil" />
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
					<td>
						<button type="button" class="record-delete" aria-label="Kaydı sil" @click="$emit('delete', property._id)">
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
					</td>
				</tr>
			</tbody>
		</table>

		<div class="properties-mobile-list">
			<article v-for="property in properties" :key="`${property._id}-mobile`" class="property-mobile-card">
				<div class="record-headline">
					<p class="property-mobile-card__eyebrow">{{ property.city }}</p>
					<button type="button" class="record-delete" aria-label="Kaydı sil" @click="$emit('delete', property._id)">
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
				</div>

				<div>
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
