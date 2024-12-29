<template>
  <div class="chart-container">
    <h4 class="titulo">Resumo de movimentos</h4>
    <Empty image-size="150px" v-if="series.length <= 0" />
    <apexchart width="100%" :options="options" :series="series" v-else />
  </div>
</template>

<script setup lang="ts">
import Empty from '@/shared/components/Empty.vue';
import { reactive, ref } from 'vue';

// Série de dados
// const series = ref([
//   {
//     name: "Receitas",
//     data: [1, 15, 26, 20, 33, 27]
//   },
//   {
//     name: "Despesas",
//     data: [3, 33, 21, 42, 19, 32]
//   },
//   {
//     name: "Balanço",
//     data: [0, 39, 52, 11, 29, 43]
//   }
// ]);

const series = ref([]);

var colorPalette = ['#00D8B6', '#FF4560', '#FEB019']

// Configuração do gráfico
const options = reactive({
  chart: {
    height: '100%',
    type: 'line',
    zoom: {
      enabled: false
    },
    dropShadow: {
      enabled: true,
      top: 3,
      left: 2,
      blur: 4,
      opacity: 1,
    },
    toolbar: {
      show: false
    }
  },
  theme: {
    mode: 'light'
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
    width: 2
  },
  markers: {
    size: 6,
    strokeWidth: 0,
    hover: {
      size: 9
    }
  },
  grid: {
    show: true,
    padding: {
      bottom: 0
    }
  },
  labels: ['01/15/2002', '01/16/2002', '01/17/2002', '01/18/2002', '01/19/2002', '01/20/2002'],
  xaxis: {
    tooltip: {
      enabled: false
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -20
  }
});
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  min-height: 200px;
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
