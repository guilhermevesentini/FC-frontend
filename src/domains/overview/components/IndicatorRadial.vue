<template>
  <div>
    <apexchart width="100%" type="radialBar" :options="options" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// Série de valores para 5 categorias
const series = ref([80, 55, 70, 65]); // Valores de exemplo para cada categoria

// Configuração do gráfico
const options = reactive({
  chart: {
    type: 'radialBar',
    height: 350,
    width: 380,
  },
  theme: {
    mode: 'light'
  },
  plotOptions: {
    radialBar: {
      size: undefined,
      inverseOrder: true,
      hollow: {
        margin: 5,
        size: '30%',
        background: 'transparent',

      },
      track: {
        show: false,
      },
      startAngle: -180,
      endAngle: 180

    },
  },
  stroke: {
    lineCap: 'round'
  },
  series: series,
  labels: ['June', 'May', 'April'],
  legend: {
    show: true,
    floating: true,
    position: 'right',
    offsetX: 70,
    offsetY: 200
  },
});
</script>

<style lang="scss" scoped>
/* Estilização opcional */
</style>
