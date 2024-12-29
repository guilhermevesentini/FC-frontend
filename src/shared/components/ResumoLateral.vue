<template>
  <div class="FC-Resumo">
    <div class="FC-Resumo_item">
      <slot name="header_total"></slot>
      <span v-if="loading">...</span>
      <span v-else>{{ total }}</span>
    </div>
    <div class="FC-Resumo_item">
      <slot name="header_pago"></slot>
      <span v-if="loading">...</span>
      <span v-else>{{ totalPago }}</span>
    </div>
    <div class="FC-Resumo_item">
      <slot name="header_pendente"></slot>
      <span v-if="loading">...</span>
      <span v-else>{{ totalPendente }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  total: string
  totalPago: string
  totalPendente: string
  loading: boolean
}

defineProps<IProps>()

</script>

<style lang="scss">
.FC-Resumo {
  display: flex;
  flex-direction: column;
  margin: 0 0 0 5px;

  &_item {
    padding: 0.5rem 0.5rem;
    background-color: var(--background-color-dark);
    color: var(--text-primary);
    border-radius: 5px;
    margin: 3px;

    h4 {
      font-weight: 600;
    }
  }

  &_item:first-child {
    margin: 0 3px 3px 3px;
  }
}
</style>