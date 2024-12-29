<template>
  <div class="indicator_donut">
    <h4 class="titulo">Categorias de despesas</h4>
    <div v-if="showNodata" style="height: 100%;">
      <Empty image-size="150px" />
    </div>
    <apexchart ref="chart" width="100%" type="donut" :options="options" :series="series" :key="seriesKey" v-else />
  </div>

</template>

<script setup lang="ts">
import { ECategoriaOptions } from '@/domains/despesas/types';
import { computed, reactive, watch, ref, nextTick } from 'vue';
import ApexCharts from 'apexcharts';
import Empty from '@/shared/components/Empty.vue';
import { EcolorsPalette } from '@/core/@types/enums';

type IProps = {
  labels: string[];
  values: number[];
};

const props = defineProps<IProps>();

const series = ref(props.values);

const seriesKey = ref(Date.now());

const showNodata = ref(false)

const labels = computed(() =>
  props.labels.map((item) => {
    const categoria = ECategoriaOptions.find(opt => opt.value === String(item));
    return categoria ? categoria.label : 'Indefinida';
  })
);

const chart = ref<ApexCharts | null>(null);

const options = reactive({
  chart: {
    type: 'donut',
    heigth: 200,
  },
  theme: {
    mode: 'light'
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      customScale: 0.8,
      donut: {
        size: '75%',
      },
      offsetY: 20,
    },
  },
  fill: {
    type: 'gradient',
  },
  colors: EcolorsPalette,
  labels: labels,
  legend: {
    position: 'left',
    offsetY: 80,
  },
});

watch(() => props.values, (newSeries) => {
  series.value = newSeries;
  seriesKey.value = Date.now();
  if (!newSeries.length) showNodata.value = true
  else showNodata.value = false
});
</script>

<style lang="scss" scoped>
.indicator_donut {
  width: 100%;
  min-height: 360px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: left;

  .titulo {
    padding: 0.5rem 0;
    /* Reduz o espaçamento do título */
    font-size: 1rem;
    /* Ajusta o tamanho do texto */
    text-align: left;
  }
}
</style>
