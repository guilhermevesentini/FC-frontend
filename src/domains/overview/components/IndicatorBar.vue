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
import { EcolorsPaletteMapper } from '@/core/@types/enums';
import { formatCurrency } from '@/core/utils/utils';
import type { CategoriaDto } from '@/core/services/ports/CategoriasGateway';
import { useDarkModeStore } from '@/core/store/darkMode/useDarkModeStore';
import { storeToRefs } from 'pinia';

type IProps = {
  labels: string[];
  values: number[];
  listaCategoria: CategoriaDto[];
};

const props = defineProps<IProps>();

const darkModeStore = useDarkModeStore();
const { thema } = storeToRefs(darkModeStore);

const seriesKey = ref(Date.now());
const showNodata = ref(false);

const chart = ref<ApexCharts | null>(null);


const series = computed(() => {
  return [
    {
      name: 'Despesas',
      data: props.values.map((value, index) => ({
        x: labels.value[index],
        y: value,
        fillColor: categoryColors.value[index],
      })),
    },
  ];
});

const categoryColors = computed(() => {
  const listaCategoria = props.listaCategoria;

  const labels = props.labels;

  return labels.map((item) => {
    const categoria = listaCategoria.find((opt) => opt.id === item);
    return categoria ? categoria.color : EcolorsPaletteMapper.AzulIntenso;
  });
});

const labels = computed(() => {
  const listaCategoria = props.listaCategoria;

  const labels = props.labels;

  return labels.map((item) => {
    const categoria = listaCategoria.find((opt) => opt.id === item);
    return categoria ? categoria.nome : 'Indefinida';
  });
});

const options = reactive({
  chart: {
    type: 'bar',
    height: '100%',
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
  plotOptions: {
    bar: {
      horizontal: true,
      endingShape: 'rounded',
      columnWidth: '90%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: labels,
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: 'top',
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return formatCurrency(val);
      },
    },
  },
});

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

watch(
  () => props.values,
  (newValues) => {
    series.value[0].data = newValues.map((value, index) => ({
      x: labels.value[index],
      y: value,
      fillColor: categoryColors.value[index],
    }));
    seriesKey.value = Date.now();
    showNodata.value = newValues.length === 0;
  }
);
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
