<template>
  <div style="height: 100%;">
    <div v-if="showNodata" style="height: 100%;">
      <Empty image-size="200px" />
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
  colors: EcolorsPalette,
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

watch(() => props.values, (newSeries) => {
  series.value = newSeries;
  seriesKey.value = Date.now();
  if (!newSeries.length) showNodata.value = true
  else showNodata.value = false
});
</script>

<style lang="scss" scoped></style>
