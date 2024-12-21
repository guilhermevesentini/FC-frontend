<template>
  <div class="container_page">
    <div class="content-area">
      <div class="main">
        <el-row class="sparkboxes">
          <IndicatorSpark title="Total" :valor="sparks.total.value.toString()" :series="sparks.total.values.slice(-5)"
            :gradient-type="1" />

          <IndicatorSpark title="Pendentes" :valor="sparks.pendente.value.toString()"
            :series="sparks.pendente.values.slice(-5)" :gradient-type="2" />

          <IndicatorSpark title="Pagos" :valor="sparks.pago.value.toString()" :series="sparks.pago.values.slice(-5)"
            :gradient-type="3" />

          <IndicatorSpark title="Balanço" :valor="sparks.balanco.value.toString().slice(-5)"
            :series="sparks.balanco.values.slice(-5)" :gradient-type="4" />
        </el-row>
        <el-row class="sparkboxes">
          <el-col :span="12">
            <IndicatorLines />
          </el-col>
          <el-col :span="10">
            <IndicatorDonut :labels="donut.labels" :values="donut.values" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { container } from '@/inversify.config';
import IndicatorDonut from './indicadores/sparks/IndicatorDonut.vue';
import IndicatorLines from './indicadores/sparks/IndicatorLines.vue';
import IndicatorSpark from './indicadores/sparks/IndicatorSpark.vue';
import { overviewContainer } from './container/overviewContainer';
import { onMounted, onUnmounted, ref } from 'vue';
import { DespesasIndicadoresGatewayDi, type DespesasDonutOutputDto, type DespesasSparkTotalOutputDto, type IDespesasIndicadoresGateway } from './services/ports/DespesasIndicadoresGateway';

container.load(overviewContainer)

const overviewGateway = container.get<IDespesasIndicadoresGateway>(DespesasIndicadoresGatewayDi)

const sparks = ref<DespesasSparkTotalOutputDto>({
  balanco: {
    value: 0,
    values: []
  },
  pago: {
    value: 0,
    values: []
  },
  pendente: {
    value: 0,
    values: []
  },
  total: {
    value: 0,
    values: []
  }
})

const donut = ref<DespesasDonutOutputDto>({
  labels: [],
  values: []
})

const obterSparks = async () => {
  const response = await overviewGateway.sparkTotal({ inicio: new Date(2024, 6, 10).toString(), fim: new Date().toString() })

  const result = response || {};

  // Estrutura de dados esperada para 'sparks.value'
  sparks.value = {
    total: {
      value: result?.result?.total?.value || 0,  // Valor total (usando 0 como fallback caso não exista)
      values: result?.result?.total?.values || [] // Array de valores do total (fallback para array vazio)
    },
    balanco: {
      value: result?.result?.balanco?.value || 0,  // Valor do balanco
      values: result?.result?.balanco?.values || [] // Array de valores do balanco
    },
    pendente: {
      value: result?.result?.pendente?.value || 0,  // Valor pendente
      values: result?.result?.pendente?.values || [] // Array de valores pendentes
    },
    pago: {
      value: result?.result?.pago?.value || 0,  // Valor pago
      values: result?.result?.pago?.values || [] // Array de valores pagos
    }
  };
}

const obterDonut = async () => {
  const response = await overviewGateway.obterDonut({ inicio: new Date(2024, 6, 10).toString(), fim: new Date().toString() })

  donut.value.labels = response.result?.labels || [];
  donut.value.values = response.result?.values || [];
}

onMounted(async () => {
  await obterSparks()
  await obterDonut()
})

onUnmounted(() => {
  container.unload(overviewContainer)
})

</script>

<style lang="scss" scoped>
.container_page {
  background-color: #fff;
  padding: 10px;
  height: auto;
  border-radius: 5px;
  min-height: calc(100vh - 60px);

  .content-area {
    margin: 0 auto;
  }

  .shadow {
    box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.08);
  }

  .sparkboxes {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }

  .sparkboxes .sparkboxes .box .sparkboxes strong {
    position: relative;
    z-index: 3;
    top: -8px;
    color: #fff;
  }
}
</style>