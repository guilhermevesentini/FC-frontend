<template>
  <div class="chart-container">
    <apexchart :options="options" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const series = ref([{
  name: 'Income',
  type: 'column',
  data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 4.1, 2.8, 3.2, 2.9]
}, {
  name: 'Cashflow',
  type: 'column',
  data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 4, 3, 2, 4]
}, {
  name: 'Revenue',
  type: 'line',
  data: [20, 29, 32, 31, 25, 30, 40, 25, 40, 30, 30, 42]
}]);

var options = {
  series: series,
  chart: {
    height: 350,
    type: 'line',
    stacked: false,
    toolbar: {
      show: false // Desativa os recursos no canto superior direito
    }
  },
  theme: {
    mode: 'light'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: [1, 1, 4]
  },
  xaxis: {
    categories: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  },
  yaxis: [
    {
      seriesName: 'Income',
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#008FFB'
      },
      labels: {
        style: {
          colors: '#008FFB',
        }
      },
      tooltip: {
        enabled: true
      }
    },
    {
      seriesName: 'Cashflow',
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    {
      seriesName: 'Revenue', // Mantenha visível o eixo Y para esta série, se necessário
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: false,
      },
    }
  ],
  tooltip: {
    fixed: {
      enabled: true,
      position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
      offsetY: 30,
      offsetX: 60
    },
  },
  legend: {
    horizontalAlign: 'left',
    offsetX: 40
  }
};
</script>

<style lang="scss" scoped>
.chart-container {
  box-sizing: border-box;
  /* Define uma largura fixa */
  height: auto;
  /* Define a altura fixa */
  overflow: hidden;
  /* Evita que o conteúdo passe do tamanho do contêiner */
}
</style>
