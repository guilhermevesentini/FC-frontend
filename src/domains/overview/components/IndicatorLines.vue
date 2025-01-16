<template>
  <div class="chart-container">
    <h4 class="titulo">Resumo mensal de movimentos de {{ new Date().getFullYear() }}</h4>
    <Empty image-size="200px" v-if="series.length === 0" />
    <apexchart ref="chart" class="lines-chart" width="100%" :options="options" :series="series" v-else />
  </div>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '@/core/store/darkMode/useDarkModeStore';
import Empty from '@/shared/components/Empty.vue';
import { storeToRefs } from 'pinia';
import { ref, reactive, watch } from 'vue';

type IProps = {
  resumo: {
    despesas: number[];
    receitas: number[];
    balanco: number[];
  };
};

const props = defineProps<IProps>();

const chart = ref<ApexCharts | null>(null);

const darkModeStore = useDarkModeStore();
const { thema } = storeToRefs(darkModeStore);

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
  theme: {
    mode: thema.value,
    palette: 'palette1',
    monochrome: {
      enabled: false,
      color: '#255aee',
      shadeTo: 'light',
      shadeIntensity: 0.65,
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
    offsetY: 0
  },
});

watch(
  () => props.resumo,
  (newResumo) => {
    const hasValues = newResumo.receitas.length >= 1 && newResumo.despesas.length >= 1 && newResumo.balanco.length >= 1;

    if (!hasValues) return series.value = []

    series.value = [
      {
        name: 'Receitas',
        data: newResumo.receitas.length >= 1 ? newResumo.receitas : [],
      },
      {
        name: 'Despesas',
        data: newResumo.despesas.length >= 1 ? newResumo.despesas : [],
      },
      {
        name: 'Balanço',
        data: newResumo.balanco.length >= 1 ? newResumo.balanco : [],
      },
    ];
  },
  { deep: true }
);

watch(
  () => thema.value,
  (newTheme) => {
    options.theme.mode = newTheme;
    if (chart.value) {
      chart.value.updateOptions({
        theme: { mode: newTheme },
      });
    }
  },
  { immediate: true }
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
    padding: 1rem;
    display: flex;
    justify-content: center;
  }
}
</style>
