<template>
  <div class="indicator_bar">
    <h4 class="titulo">Categorias de despesas</h4>
    <div v-if="showNodata">
      <Empty image-size="200px" />
    </div>
    <apexchart class="bar-chart" style="padding: 1rem;" ref="chart" width="100%" type="bar" :options="options"
      :series="series" :key="seriesKey" v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import Empty from '@/shared/components/Empty.vue';
import { EcolorsPaletteMapper } from '@/core/@types/enums'; // Certifique-se de importar a paleta de cores
import { formatCurrency } from '@/core/utils/utils';
import { ECategoriaOptions } from '@/domains/despesas/types';

type IProps = {
  labels: string[];
  values: number[];
};

const props = defineProps<IProps>();

const categoryColors = computed(() => {
  return props.labels.map((label) => {
    const categoria = ECategoriaOptions.find((opt) => opt.value === String(label));
    return categoria ? categoria.color : EcolorsPaletteMapper.AzulIntenso;
  });
});

const labels = computed(() =>
  props.labels.map((item) => {
    const categoria = ECategoriaOptions.find(opt => opt.value === String(item));
    return categoria ? categoria.label : 'Indefinida';
  })
);

const series = reactive([
  {
    name: 'Despesas',
    data: props.values,
  },
]);

const seriesKey = ref(Date.now());
const showNodata = ref(false);

watch(
  () => props.values,
  (newValues) => {
    series[0].data = newValues;
    seriesKey.value = Date.now();
    showNodata.value = newValues.length === 0;
  }
);

const options = reactive({
  chart: {
    type: 'bar',
    height: '100%',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return formatCurrency(val);
    },
  },
  xaxis: {
    categories: labels,
  },
  fill: {
    opacity: 1,
  },
  colors: categoryColors,
  legend: {
    position: 'top',
  },
});
</script>

<style lang="scss" scoped>
.indicator_bar {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: left;
}
</style>
