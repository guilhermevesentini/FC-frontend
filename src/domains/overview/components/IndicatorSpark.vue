<template>
  <el-col :span="5" :xs="24" :class="['box box1', gradientClass]">
    <div class="details">
      <h3>{{ title }}</h3>
      <h4>{{ formatCurrency(valor) }}</h4>
    </div>
    <div v-if="showNoContent">
      <Empty class="no-content" :only-icon="true" image-size="50px" />
    </div>
    <apexchart width="100%" height="150px" type="line" :options="options" :series="series" :key="seriesKey" v-else />
  </el-col>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { formatCurrency } from "@/shared/utils/utils";
import Empty from '@/shared/components/Empty.vue';

type IProps = {
  title: string;
  valor: string;
  series: number[];
  gradientType: number;
}

const props = defineProps<IProps>();

// Use ref to store the series as an array of numbers directly
const series = ref([{ data: props.series }]);

// Add a key to force the re-render of the chart when data changes
const seriesKey = ref(Date.now());

const showNoContent = ref(false)

const options = reactive({
  chart: {
    type: 'line',
    height: '100%',
    sparkline: {
      enabled: true,
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.5,
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  markers: {
    size: 0,
  },
  grid: {
    padding: {
      top: 10,
      bottom: 90,
      left: 120,
      right: 0,
    }
  },
  colors: ['#FFF'],
  tooltip: {
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: () => '',
      },
    }
  }
});

const gradientMap: { [key: number]: string } = {
  1: 'gradient-type-1',
  2: 'gradient-type-2',
  3: 'gradient-type-3',
  4: 'gradient-type-4',
};

// Computa a classe com base no número passado por props
const gradientClass = computed(() => gradientMap[props.gradientType] || 'gradient-default');

// Watcher para observar mudanças nas props e atualizar a série
watch(() => props.series, (newSeries) => {
  series.value = [{ data: newSeries }];
  seriesKey.value = Date.now();  // Forçar re-renderizando o gráfico

  if (newSeries.every(value => value === 0)) {
    showNoContent.value = true;
  } else {
    showNoContent.value = false;
  }
});
</script>


<style lang="scss" scoped>
.box {
  background-color: #2B2D3E;
  padding: 25px 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-shadow: 0 1px 1px 1px #666;
  box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.08);
  position: relative;
  border-radius: 5px;
  height: 50px;
  max-height: 50px;

  .details {
    position: absolute;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 1rem;
    height: 50px;
    max-height: 50px;
  }

  .no-content {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    align-content: center;
    height: 47px;
    position: absolute;
    right: 35px;
    top: -23px;
  }
}

.box1 {
  height: auto;
  height: 100px;
  min-height: 100px;
}

.gradient-type-1 {
  background-image: linear-gradient(135deg, #ABDCFF 10%, #0396FF 100%);
}

.gradient-type-2 {
  background-image: linear-gradient(135deg, #FFD3A5 10%, #FD6585 100%);
}

.gradient-type-3 {
  background-image: linear-gradient(135deg, #2AFADF 10%, #4C83FF 100%);
}

.gradient-type-4 {
  background-image: linear-gradient(135deg, #EE9AE5 10%, #5961F9 100%);
}

/* Gradiente padrão */
.gradient-default {
  background-image: linear-gradient(135deg, #cccccc 10%, #999999 100%);
}
</style>
