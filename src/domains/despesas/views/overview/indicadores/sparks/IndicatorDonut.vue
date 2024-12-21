<template>
  <div>
    <apexchart ref="chart" width="100%" type="donut" :options="options" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { ECategoriaOptions } from '@/domains/despesas/types';
import { computed, reactive, watch, ref, nextTick } from 'vue';
import ApexCharts from 'apexcharts';

type IProps = {
  labels: string[];
  values: number[];
};

const props = defineProps<IProps>();

const series = computed(() => props.values);

const labels = computed(() =>
  props.labels.map((item) => {
    const categoria = ECategoriaOptions.find(opt => opt.value === String(item));
    return categoria ? categoria.label : 'Indefinida';
  })
);

const chart = ref<ApexCharts | null>(null);

const colorPalette = ['#00D8B6', '#008FFB', '#FEB019', '#FF4560', '#775DD0'];

const options = reactive({
  chart: {
    type: 'donut',
    width: '100%',
    height: 400,
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
  colors: colorPalette,
  labels: [],
  legend: {
    position: 'left',
    offsetY: 80,
  },
});

watch([labels, series], async () => {
  if (chart.value) {
    await nextTick();
    chart.value.updateOptions({
      labels: labels.value,
    });
  }
});
</script>

<style lang="scss" scoped></style>
