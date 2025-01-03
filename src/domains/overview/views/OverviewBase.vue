<template>
  <div class="container_page">
    <div class="content-area">
      <el-row class="main">
        <el-col :span="24" class="filtros">
          <el-row class="container" justify="space-between">
            <el-col :span="4">
              <h3>Filtros</h3>
            </el-col>
            <el-col class="hidden-sm-and-down" span="auto" style="display: flex; align-items: center;">
              <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
            </el-col>
            <el-col :span="4" style="display: flex; justify-content: flex-end;">
              <el-popover trigger="click" v-model:visible="popoverVisible" placement="left-start" width="200">
                <div>
                  <span>Contas:</span>
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
            <IndicatorSpark title="Despesas" :valor="sparks.totalDespesas.value.toString()" v-loading="loading"
              :series="sparks.totalDespesas.values" :gradient-type="1" />
            <IndicatorSpark title="Receitas" :valor="sparks.totalReceitas.value.toString()" v-loading="loading"
              :series="sparks.totalReceitas.values" :gradient-type="3" />
            <IndicatorSpark title="Pendentes" :valor="sparks.pendente.value.toString()" v-loading="loading"
              :series="sparks.pendente.values" :gradient-type="2" />
            <IndicatorSpark title="Balanço" :valor="sparks.balanco.value.toString()" v-loading="loading"
              :series="sparks.balanco.values" :gradient-type="4" />
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row class="sparkboxes indicadores">
            <el-col :xs="24" :sm="11" :md="11" :lg="11">
              <IndicatorLines :resumo="resumo" v-loading="loading" />
            </el-col>
            <el-col :xs="24" :sm="11" :md="11" :lg="11">
              <IndicatorBar :labels="donut.labels" :values="donut.values" v-loading="loading" />
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
import { Filter } from '@element-plus/icons-vue';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';
import IndicatorSpark from '../components/IndicatorSpark.vue';
import IndicatorLines from '../components/IndicatorLines.vue';
import { OverviewGatewayDi, type IOverviewGateway, type OverviewDonutOutputDto, type OverviewResumoMovimentoOutputDto, type OverviewSparkTotalOutputDto } from '../services/ports/OverviewGateway';
import IndicatorBar from '../components/IndicatorBar.vue';

const loading = ref(false)

const overviewGateway = container.get<IOverviewGateway>(OverviewGatewayDi);

const sparks = ref<OverviewSparkTotalOutputDto>({
  totalDespesas: { value: 0, values: [] },
  totalReceitas: { value: 0, values: [] },
  balanco: { value: 0, values: [] },
  pendente: { value: 0, values: [] },
});

const donut = ref<OverviewDonutOutputDto>({ labels: [], values: [] });

const resumo = ref<OverviewResumoMovimentoOutputDto>({
  balanco: [], despesas: [], receitas: []
});

const popoverVisible = ref(false);
const contaSelecionada = ref<string | undefined>(undefined);

const periodo = reactive({ mes: new Date().getMonth() + 1, ano: new Date().getFullYear() });

const filterDate = ref({
  inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  fim: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
});

const updateConta = (id: string) => {
  contaSelecionada.value = id;
};

const obterSparks = async (inicio: string, fim: string) => {
  const response = await overviewGateway.sparkTotal({ inicio, fim });
  if (response?.result) {
    sparks.value = {
      totalDespesas: { value: response.result.totalDespesas?.value || 0, values: response.result.totalDespesas?.values || [] },
      totalReceitas: { value: response.result.totalReceitas?.value || 0, values: response.result.totalReceitas?.values || [] },
      pendente: { value: response.result.pendente?.value || 0, values: response.result.pendente?.values || [] },
      balanco: { value: response.result.balanco?.value || 0, values: response.result.balanco?.values || [] },
    };
  }
};

const obterDonut = async (inicio: string, fim: string) => {
  const response = await overviewGateway.obterDonut({ inicio, fim });
  if (response) {
    donut.value = { labels: response.result?.labels || [], values: response.result?.values || [] };
  }
};

const obterResumo = async () => {
  const response = await overviewGateway.resumoMovimentos();
  if (response) {
    resumo.value = { despesas: response.result?.despesas || [], receitas: response.result?.receitas || [], balanco: response.result?.balanco || [] };
  }
};

// const handleDatesReq = () => {
//   return {
//     inicioReq: new Date(filterDate.value.inicio as unknown as string).toISOString(),
//     fimReq: new Date(filterDate.value.fim as unknown as string).toISOString(),
//   };
// };

const calcularDatasPeriodo = (mes: number, ano: number) => {
  const inicio = new Date(ano, mes - 1, 1).toISOString();
  const fim = new Date(ano, mes, 0).toISOString();
  return { inicio, fim };
};

const handlePeriodo = async (mes: number, ano: number) => {
  periodo.mes = mes;
  periodo.ano = ano;
  const { inicio, fim } = calcularDatasPeriodo(mes, ano);
  filterDate.value = { inicio: new Date(inicio), fim: new Date(fim) };

  try {
    loading.value = true
    await Promise.all([obterSparks(inicio, fim), obterDonut(inicio, fim)]);
  } catch (error) {
    console.error("Erro ao atualizar dados para o período selecionado:", error);
  } finally {
    loading.value = false
  }
};

onMounted(async () => {
  const { inicio, fim } = calcularDatasPeriodo(periodo.mes, periodo.ano);
  try {
    loading.value = true
    await Promise.all([obterSparks(inicio, fim), obterDonut(inicio, fim), obterResumo()]);
  } catch (error) {
    console.error("Erro ao carregar os dados iniciais:", error);
  } finally {
    loading.value = false
  }
});
</script>

<style lang="scss" scoped>
.container_page {
  background-color: var(--background-color-dark);
  padding: 10px;
  height: auto;
  border-radius: 5px;
  min-height: calc(100vh - 60px);

  .filtros {
    padding: 1rem 1rem 20px;
  }

  .content-area {
    margin: 0 auto;
  }

  .shadow {
    box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.08);
  }

  .sparkboxes {
    width: 100%;
    display: flex;
    padding: 1rem;
    justify-content: space-between;
    gap: 5px;

    .titulo {
      padding: 0.5rem 0;
      font-size: 1rem;
      text-align: left;
    }
  }

  .indicadores .el-col {
    border-radius: 7px;
    background-color: var(--background-color-darker);
  }
}
</style>
