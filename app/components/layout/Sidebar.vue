<script setup lang="ts">
const route = useRoute()

const items = [
  {
    label: 'Evler',
    to: '/properties',
    eyebrow: 'Liste',
    badge: '01'
  },
  {
    label: 'Danismanlar',
    to: '/agents',
    eyebrow: 'Kartlar',
    badge: '02'
  },
  {
    label: 'Satislar',
    to: '/sales',
    eyebrow: 'Kanban',
    badge: '03'
  }
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <div class="sidebar__brand-mark">IC</div>
      <div>
        <p class="sidebar__eyebrow">Estate workflow</p>
        <h1 class="sidebar__title">Iceberg CRM</h1>
      </div>
    </div>

    <nav class="sidebar__nav" aria-label="Ana navigasyon">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item.to) }"
      >
        <span class="sidebar__badge">{{ item.badge }}</span>
        <span>
          <strong>{{ item.label }}</strong>
          <small>{{ item.eyebrow }}</small>
        </span>
      </NuxtLink>
    </nav>

    <div class="sidebar__footer">
      <p class="sidebar__eyebrow">Akis</p>
      <p class="sidebar__footer-text">
        Sozlesmeden tapuya kadar tum satis akisini tek panelden yonet.
      </p>
    </div>
  </aside>
</template>