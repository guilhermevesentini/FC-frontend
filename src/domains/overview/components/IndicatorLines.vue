<template>
  <div class="chart-container">
    <h4 class="titulo">Resumo mensal de movimentos de {{ new Date().getFullYear() }}</h4>
    <Empty image-size="200px" v-if="series.length === 0" />
    <apexchart class="lines-chart" width="100%" :options="options" :series="series" v-else />
  </div>
</template>

<script setup lang="ts">
import Empty from '@/shared/components/Empty.vue';
import { ref, reactive, watch } from 'vue';

type IProps = {
  resumo: {
    despesas: number[];
    receitas: number[];
    balanco: number[];
  };
};

const props = defineProps<IProps>();

const series = ref([
  {
    name: 'Receitas',
    data: props.resumo.receitas,
  },
  {
    name: 'Despesas',
    data: props.resumo.despesas,
  },
  {
    name: 'Balanço',
    data: props.resumo.balanco,
  },
]);

const colorPalette = ['#00D8B6', '#FF4560', '#FEB019'];

const options = reactive({
  chart: {
    height: '100%',
    type: 'line',
    zoom: {
      enabled: false,
    },
    dropShadow: {
      enabled: true,
      top: 3,
      left: 2,
      blur: 4,
      opacity: 1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          width: '100%',
          height: '100%',
        },
      },
    },
  ],
  colors: colorPalette,
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  markers: {
    size: 6,
    strokeWidth: 0,
    hover: {
      size: 9,
    },
  },
  grid: {
    show: true,
    padding: {
      bottom: 0,
    },
  },
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  xaxis: {
    tooltip: {
      enabled: false,
    },
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    offsetY: 10,
  },
});

watch(
  () => props.resumo,
  (newResumo) => {
    series.value = [
      {
        name: 'Receitas',
        data: newResumo.receitas,
      },
      {
        name: 'Despesas',
        data: newResumo.despesas,
      },
      {
        name: 'Balanço',
        data: newResumo.balanco,
      },
    ];
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: left;

  .lines-chart {
    display: flex;
    justify-content: center;
  }
}
</style>
