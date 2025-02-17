<template>
  <div class="container_page">
    <div class="content-area">
      <el-row class="main">
        <el-col :span="24" class="filtros">
          <el-row class="container" justify="space-between">
            <el-col span="auto" style="display: flex; align-items: center; justify-content: center;width: 100%;">
              <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
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
              <IndicatorBar :labels="donut.labels" :values="donut.values" v-loading="loading"
                :lista-categoria="categoriasStore.categoriasList" />
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
import { OverviewGatewayDi, type IOverviewGateway, type OverviewDonutOutputDto, type OverviewResumoMovimentoOutputDto, type OverviewSparkTotalOutputDto } from './services/ports/OverviewGateway';
import IndicatorSpark from './components/IndicatorSpark.vue';
import IndicatorLines from './components/IndicatorLines.vue';
import IndicatorBar from './components/IndicatorBar.vue';
import { useCategoriasStore } from '@/core/store/categoriasStore/useCategoriasStore';


const loading = ref(false)

const overviewGateway = container.get<IOverviewGateway>(OverviewGatewayDi);

const categoriasStore = useCategoriasStore()

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

const periodo = reactive({ mes: new Date().getMonth() + 1, ano: new Date().getFullYear() });

const filterDate = ref({
  inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  fim: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
});

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
  const [fetchCategoriasResponse, donutResponse] = await Promise.all([
    categoriasStore.fetchCategoriasLista(),
    overviewGateway.obterDonut({ inicio, fim })
  ]);

  if (donutResponse) {
    donut.value = {
      labels: donutResponse.result?.labels || [],
      values: donutResponse.result?.values || []
    };
  }
};

const obterResumo = async (ano: number) => {
  const response = await overviewGateway.resumoMovimentos({ ano: ano });
  if (response) {
    resumo.value = { despesas: response.result?.despesas || [], receitas: response.result?.receitas || [], balanco: response.result?.balanco || [] };
  }
};

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
    await Promise.all([categoriasStore.fetchCategoriasLista(), obterSparks(inicio, fim), obterDonut(inicio, fim), obterResumo(ano)]);
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
    await Promise.all([categoriasStore.fetchCategoriasLista(), obterSparks(inicio, fim), obterDonut(inicio, fim), obterResumo(periodo.ano)]);
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
    gap: 15px;

    .titulo {
      padding: 0.5rem 0;
      font-size: 1rem;
      text-align: left;
    }
  }

  .indicadores .el-col {
    border-radius: 7px;
    margin-bottom: 1rem;
    background-color: var(--background-color--apex-card);
  }
}
</style>
