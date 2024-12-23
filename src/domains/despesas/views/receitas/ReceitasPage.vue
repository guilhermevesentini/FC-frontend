<template>
  <el-row>
    <el-col class="container_page" :xs="24" :md="20">
      <el-row class="body">
        <el-col class="hidden-sm-and-up" :span="24"
          style="margin: 0.5rem 0 1rem; padding: 0; display: flex; align-items: center; justify-content: center;">
          <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
        </el-col>
        <el-col :span="24" style="margin: 0.5rem 0 1rem;">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="4">
              <BreadCrumb name="Receitas" />
            </el-col>
            <el-col class="hidden-sm-and-down" span="auto"
              style="margin: 0; padding: 0; display: flex; align-items: center;">
              <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
            </el-col>
            <el-col :span="4" style="display: flex;flex-wrap: wrap; justify-content: flex-end;">
              <FCButtonIcon type="primary" circle :icon="Plus" @click="handleAdicionar" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <TableFilterableFrame v-on:handle-editar="editarReceita" v-on:handle-deletar="deletarReceita"
            :produtos="perPeriodlistaDeReceitas">
            <template #tableCollumn>
              <el-table-column label="" prop="status" width="50" sortable>
                <template v-slot="scope">
                  <IconInsideTable :name="financeHandler.defineStatus(scope.row.status).name"
                    :color="financeHandler.defineStatus(scope.row.status).color"
                    :title="financeHandler.defineStatus(scope.row.status).title" />
                </template>
              </el-table-column>
              <el-table-column label="Valor" prop="valor" width="120">
                <template v-slot="scope">
                  {{ formatCollumnNumber(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="Categoria" prop="categoria" width="150" header-align="center" sortable>
                <template #default="{ row }">
                  <span class="custom-label" :style="{ backgroundColor: getCategoryColor(row.categoria) }">
                    {{ getCategoryLabel(row.categoria) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Nome" prop="nome" width="auto" />
              <el-table-column label="Recebimento" prop="recebimento" width="150" sortable>
                <template v-slot="scope">
                  {{ formatDate(scope.row.recebimento) }}
                </template>
              </el-table-column>
            </template>
          </TableFilterableFrame>
        </el-col>
      </el-row>
    </el-col>
    <el-col class="hidden-sm-and-down" :span="4">
      <ResumoLateral v-loading="loading" label="Total Receitas" :total="totalDeDespesas" :totalPago="totalPago"
        :totalPendente="totalPendente">
        <template #header_total>
          <h4>Total Receitas</h4>
        </template>
        <template #header_pago>
          <h4>Total Recebido</h4>
        </template>
        <template #header_pendente>
          <h4>Total Pendente</h4>
        </template>
      </ResumoLateral>
    </el-col>
  </el-row>

  <AdicionarReceitas v-model="showAdicionar" v-on:handle-fechar="handleFecharDrawer" />
</template>

<script setup lang="ts">
import { container } from '@/inversify.config';
import BreadCrumb from '@/shared/components/BreadCrumb.vue';
import FCButtonIcon from '@/shared/components/buttons/Criar/FCButtonIcon.vue';
import DatePeriodoPicker from '@/shared/components/DatePeriodoPicker.vue';
import {
  Plus
} from '@element-plus/icons-vue';
import IconInsideTable from "./../../components/IconInsideTable.vue";
import { receitasContainer } from './container/receitasContainer';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import AdicionarReceitas from './views/adicionar/AdicionarReceitas.vue';
import TableFilterableFrame from '@/shared/components/TableFilterableFrame.vue';
import { ReceitasGatewayDi, type ReceitaInputDto, type ReceitaOutputDto, type ReceitasGateway } from './services/ports/ReceitasGateway';
import { ECategoriaReceitasOptions, ReceitasInitialState } from './types';
import useFinanceHandler from '../../composables/useFinanceHandler';
import { formatCurrency, formatDate } from '@/shared/utils/utils';
import { ReceitasFactoryDi, type IReceitasFactory } from './ReceitasFactory';
import { contasContainer } from '../contas/container/contasContainer';
import ResumoLateral from '@/shared/components/ResumoLateral.vue';

const showAdicionar = ref(false);
const loading = ref(false);

const receitasGateway = container.get<ReceitasGateway>(ReceitasGatewayDi);
const receitasFactory = container.get<IReceitasFactory>(ReceitasFactoryDi);

const perPeriodlistaDeReceitas = ref<ReceitaInputDto[] | undefined>([]);

const Receita = ref<ReceitaInputDto>(ReceitasInitialState);
const listaDeReceitas = ref<ReceitaInputDto[]>();

const totalDeDespesas = computed(() => {
  return financeHandler.obterTotal(perPeriodlistaDeReceitas?.value || [])
})

const totalPago = computed(() => {
  const findDespesasPagas = perPeriodlistaDeReceitas?.value?.filter(receita => {
    if (receita.status == '1') {
      return receita
    }
  })

  return financeHandler.obterTotal(findDespesasPagas || [])
})

const totalPendente = computed(() => {
  const receitas = perPeriodlistaDeReceitas.value;

  const findDespesasPagas = receitas?.filter(receita => {
    if (receita.status == '2') {
      return receita
    }
  })

  return financeHandler.obterTotal(findDespesasPagas || [])
})

const financeHandler = useFinanceHandler();

const handleAdicionar = () => {
  showAdicionar.value = true
}

const periodo = reactive({
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear()
})

const editarReceita = () => { }
const deletarReceita = () => { }

const formatCollumnNumber = (row: ReceitaInputDto) => {
  const valor = row.valor;

  return formatCurrency(valor)
}

const getCategoryColor = (value: string) => {
  return ECategoriaReceitasOptions[Number(value)].color || "#ccc";
}

const getCategoryLabel = (value: string) => {
  const option = ECategoriaReceitasOptions.find((item) => item.value === value);
  return option ? option.label : "Desconhecido";
}

const obterReceitas = async () => {
  try {
    loading.value = true

    const response = await receitasGateway.obter(periodo.mes, periodo.ano);

    if (response?.statusCode != 200) {

      listaDeReceitas.value = []
      perPeriodlistaDeReceitas.value = []

      return
    }

    listaDeReceitas.value = response.result || [];

    if (listaDeReceitas.value) {
      perPeriodlistaDeReceitas.value = receitasFactory.create(listaDeReceitas.value)
    } else {
      listaDeReceitas.value = []
    }

  } catch (err) {
    console.log(err);
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

const handlePeriodo = async (mes: number, ano: number) => {
  console.log(mes, ano);

  periodo.mes = mes
  periodo.ano = ano

  await obterReceitas()
}

const handleFecharDrawer = (async () => {
  showAdicionar.value = false;
  await obterReceitas()
})

onMounted(() => {
  obterReceitas();
})
</script>

<style lang="scss" scoped>
.container_page {
  height: auto;
  min-height: 100vh;

  .body {
    min-height: auto;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    overflow: hidden;
  }

  .custom-label {
    padding: 0 5px;
    text-align: center;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    color: #fff;
  }
}
</style>