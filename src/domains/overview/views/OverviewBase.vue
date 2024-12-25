<template>
  <div class="container_page">
    <div class="content-area">
      <el-row class="main">
        <el-col :span="24" class="filtros">
          <el-row class="container" justify="space-between">
            <el-col :span="4">
              <h3>Filtros</h3>
            </el-col>
            <el-col class="hidden-sm-and-down" span="auto"
              style="margin: 0; padding: 0; display: flex; align-items: center;">
              <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
            </el-col>
            <el-col :span="4" style="display: flex;flex-wrap: wrap; justify-content: flex-end;">
              <el-popover trigger="click" v-model:visible="popoverVisible" placement="left-start" width="200">
                <div>
                  <span style="width: 100%; margin-bottom: 10px;">Contas:</span>
                  <FCSelectContas v-model="contaSelecionada" @update:model-value="updateConta" />
                </div>
                <template #reference>
                  <Filter style="width: 20px; cursor: pointer;" />
                </template>
              </el-popover>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
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
        </el-col>
        <el-col :span="24">
          <el-row class="sparkboxes">
            <el-col :xs="24" :sm="12" :span="12" style="padding: 0 4rem 0 0;">
              <IndicatorLines />
            </el-col>
            <el-col :xs="24" :sm="10" :span="10" style="padding: 0 4rem 0 0;">
              <IndicatorDonut :labels="donut.labels" :values="donut.values" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { container } from '@/inversify.config';
import { onMounted, reactive, ref } from 'vue';
import DatePeriodoPicker from '@/shared/components/DatePeriodoPicker.vue';
import {
  Filter
} from '@element-plus/icons-vue';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';
import IndicatorSpark from '../components/IndicatorSpark.vue';
import IndicatorLines from '../components/IndicatorLines.vue';
import IndicatorDonut from '../components/IndicatorDonut.vue';
import { OverviewGatewayDi, type IOverviewGateway, type OverviewDonutOutputDto, type OverviewSparkTotalOutputDto } from '../services/ports/OverviewGateway';

const overviewGateway = container.get<IOverviewGateway>(OverviewGatewayDi)

const sparks = ref<OverviewSparkTotalOutputDto>({
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

const donut = ref<OverviewDonutOutputDto>({
  labels: [],
  values: []
})

const popoverVisible = ref(false);  // Controle da visibilidade do popover
const selectedValue = ref('');  // Valor selecionado no popover

const periodo = reactive({
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear()
})

const filterDate = ref({
  inicio: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  fim: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
})

const contaSelecionada = ref<string | undefined>(undefined)

const updateConta = (id: string) => {
  contaSelecionada.value = id
}

const obterSparks = async (inicio: string, fim: string) => {
  const response = await overviewGateway.sparkTotal({ inicio: inicio, fim: fim })

  if (!response?.result) return

  sparks.value = {
    total: {
      value: response?.result?.total?.value || 0,
      values: response?.result?.total?.values || []
    },
    balanco: {
      value: response?.result?.balanco?.value || 0,
      values: response?.result?.balanco?.values || []
    },
    pendente: {
      value: response?.result?.pendente?.value || 0,
      values: response?.result?.pendente?.values || []
    },
    pago: {
      value: response?.result?.pago?.value || 0,
      values: response?.result?.pago?.values || []
    }
  };
}

const obterDonut = async (inicio: string, fim: string) => {
  const response = await overviewGateway.obterDonut({ inicio: inicio, fim: fim })

  if (!response) return

  donut.value.labels = response.result?.labels || [];
  donut.value.values = response.result?.values || [];
}

const handleDatesReq = () => {
  const inicioReq = new Date(filterDate.value.inicio as unknown as string).toISOString();
  const fimReq = new Date(filterDate.value.fim as unknown as string).toISOString()

  return {
    inicioReq,
    fimReq
  }
}
const calcularDatasPeriodo = (mes: number, ano: number) => {
  const inicio = new Date(ano, mes - 1, 1).toISOString();
  const fim = new Date(ano, mes, 0).toISOString();
  return { inicio, fim };
};

const handlePeriodo = async (mes: number, ano: number) => {
  console.log("Período selecionado:", mes, ano);

  periodo.mes = mes;
  periodo.ano = ano;

  const { inicio, fim } = calcularDatasPeriodo(mes, ano);

  filterDate.value = {
    inicio: new Date(inicio),
    fim: new Date(fim),
  };

  try {
    await Promise.all([obterSparks(inicio, fim), obterDonut(inicio, fim)]);
  } catch (error) {
    console.error("Erro ao atualizar dados para o período selecionado:", error);
  }
};

onMounted(async () => {
  const { inicio, fim } = calcularDatasPeriodo(periodo.mes, periodo.ano);
  try {
    await Promise.all([obterSparks(inicio, fim), obterDonut(inicio, fim)]);
  } catch (error) {
    console.error("Erro ao carregar os dados iniciais:", error);
  }
});
</script>

<style lang="scss" scoped>
.container_page {
  background-color: #fff;
  padding: 10px;
  height: auto;
  border-radius: 5px;
  min-height: calc(100vh - 60px);

  .filtros {
    padding: 0px 10px 20px;
  }

  .content-area {
    margin: 0 auto;
  }

  .shadow {
    box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.08);
  }

  .sparkboxes {
    display: flex;
    justify-content: space-between;
    gap: 10px;
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