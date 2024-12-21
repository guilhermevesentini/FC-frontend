<template>
  <div class="chart-container">
    <apexchart :options="options" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// Série de dados
const series = ref([
  {
    name: "Receitas",
    data: [1, 15, 26, 20, 33, 27]
  },
  {
    name: "Despesas",
    data: [3, 33, 21, 42, 19, 32]
  },
  {
    name: "Balanço",
    data: [0, 39, 52, 11, 29, 43]
  }
]);

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
  box-sizing: border-box;
  /* Define uma largura fixa */
  height: auto;
  /* Define a altura fixa */
  overflow: hidden;
  /* Evita que o conteúdo passe do tamanho do contêiner */
  color: #feb019;
  ;
}
</style>
