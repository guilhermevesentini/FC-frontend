<template>
  <el-row>
    <el-col class="container_page" :xs="24" :md="20">
      <el-row class="body">
        <el-col :span="24" style="margin: 0.5rem 0 1rem;">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="8">
              <BreadCrumb name="Receitas" icon="💰" />
            </el-col>
            <el-col class="hidden-sm-and-down" span="auto"
              style="margin: 0; padding: 0; display: flex; align-items: center;">
              <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
            </el-col>
            <el-col :span="8" style="display: flex;flex-wrap: wrap; justify-content: flex-end;">
              <FCButtonIcon type="primary" circle :icon="Plus" @click="handleAdicionar" />
            </el-col>
          </el-row>
          <el-col class="hidden-sm-and-up" :span="24"
            style="margin: 0.5rem 0 1rem; padding: 0; display: flex; align-items: center; justify-content: center;">
            <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
          </el-col>
        </el-col>
        <el-col :span="24">
          <TableFilterableFrame :Loading="loading" v-on:handle-editar="handleEditar"
            v-on:handle-deletar="deletarReceita" :produtos="perPeriodlistaDeReceitas">
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
                  <span class="custom-label" :style="{ backgroundColor: handleCategoria(row.categoria).cor }">
                    {{ handleCategoria(row.categoria).nome }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Nome" prop="nome" width="auto" :min-width="200" />
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
      <ResumoLateral :loading="loading" label="Total Receitas" :total="totalDeDespesas" :totalPago="totalPago"
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

  <ReceitasDialog v-model="showDrawer" v-on:handle-fechar="handleFecharDrawer" :tipo="tipoDrawer" :receita="receita" />
</template>

<script setup lang="ts">
import { container } from '@/inversify.config';
import BreadCrumb from '@/shared/components/BreadCrumb.vue';
import FCButtonIcon from '@/shared/components/buttons/Criar/FCButtonIcon.vue';
import DatePeriodoPicker from '@/shared/components/DatePeriodoPicker.vue';
import {
  Plus
} from '@element-plus/icons-vue';
import { computed, onMounted, reactive, ref } from 'vue';
import TableFilterableFrame from '@/shared/components/TableFilterableFrame.vue';
import { formatCurrency, formatDate } from '@/core/utils/utils';
import ResumoLateral from '@/shared/components/ResumoLateral.vue';
import IconInsideTable from '@/domains/despesas/components/IconInsideTable.vue';
import { ElMessageBox, ElNotification } from 'element-plus';
import { useCategoriasStore } from '@/core/store/categoriasStore/useCategoriasStore';
import { storeToRefs } from 'pinia';
import { ETipoCategory } from '@/core/@types/enums';
import ReceitasDialog from './widgets/ReceitasDialog.vue';
import { ETipoReceitaDrawer, ReceitasInitialState } from './types';
import { ReceitasGatewayDi, type ReceitaInputDto, type ReceitasGateway } from './services/ports/ReceitasGateway';
import { ReceitasFactoryDi, type IReceitasFactory } from './ReceitasFactory';
import useFinanceHandler from '../despesas/composables/useFinanceHandler';

const showDrawer = ref(false);

const loading = ref(false);

const tipoDrawer = ref<ETipoReceitaDrawer>(ETipoReceitaDrawer.criar);

const receita = ref<ReceitaInputDto | undefined>(ReceitasInitialState);

const receitasGateway = container.get<ReceitasGateway>(ReceitasGatewayDi);
const receitasFactory = container.get<IReceitasFactory>(ReceitasFactoryDi);

const perPeriodlistaDeReceitas = ref<ReceitaInputDto[] | undefined>([]);

const listaDeReceitas = ref<ReceitaInputDto[]>();

const categoriasStore = useCategoriasStore()
const { categoriasList } = storeToRefs(categoriasStore)

const financeHandler = useFinanceHandler();

const periodo = reactive({
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear()
})

const handleCategoria = (categoria: string) => {
  const findCategoria = categoriasList.value.find((cat) => cat.id == categoria)

  return {
    nome: findCategoria?.nome || 'Não encontrada',
    cor: findCategoria?.color || "#ccc"
  }
}

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

const handleAdicionar = () => {
  tipoDrawer.value = ETipoReceitaDrawer.criar
  receita.value = undefined
  showDrawer.value = true
}

const handleEditar = (id: string) => {
  tipoDrawer.value = ETipoReceitaDrawer.editar

  receita.value = undefined

  const receitaSelecionada = listaDeReceitas.value?.find((receita) => receita.id === id);

  if (!receitaSelecionada) return ElNotification({
    title: 'error',
    message: 'erro ao selecionar',
    type: 'error',
    duration: 2000
  })

  if (receitaSelecionada.meses && receitaSelecionada.meses?.length <= 0) return ElNotification({
    title: 'error',
    message: 'erro ao selecionar',
    type: 'error',
    duration: 2000
  })

  const getMonth = receitaSelecionada.meses && receitaSelecionada.meses[0] || undefined;

  if (!getMonth) return ElNotification({
    title: 'error',
    message: 'erro ao selecionar',
    type: 'error',
    duration: 2000
  })

  receita.value = {
    ...receitaSelecionada,
    ...getMonth
  }

  showDrawer.value = true
}

const deletarReceita = async (row: ReceitaInputDto, multiplos?: boolean) => {
  try {
    if (!row.id) {
      return ElNotification({
        title: 'Erro',
        message: 'Erro ao selecionar a receita',
        type: 'error',
        duration: 5000,
      });
    }

    const confirmarExclusao = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        ElMessageBox.confirm(
          'Tem certeza de que deseja excluir todos os registros? <br> Esta ação não poderá ser desfeita.',
          'Confirmação',
          {
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            type: 'warning',
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });
    };

    if (multiplos) {
      const confirmado = await confirmarExclusao();
      if (!confirmado) {
        return;
      }
    }

    loading.value = true;

    const isMultiplos = multiplos ? 99 : row.mes;

    const response = await receitasGateway.excluir(row.id, isMultiplos);

    if (!response) {
      return ElNotification({
        title: 'Erro',
        message: 'Erro ao deletar a receita',
        type: 'error',
        duration: 5000,
      });
    }

    ElNotification({
      title: 'Sucesso',
      message: 'Receita deletada com sucesso',
      type: 'success',
      duration: 5000,
    });

    await obterReceitas();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};


const formatCollumnNumber = (row: ReceitaInputDto) => {
  const valor = row.valor;

  return formatCurrency(valor)
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

    await categoriasStore.fetchCategoriasLista(ETipoCategory.income)

  } catch (err) {
    console.log(err);
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

const handlePeriodo = async (mes: number, ano: number) => {
  periodo.mes = mes
  periodo.ano = ano
  await obterReceitas()
}

const handleFecharDrawer = (async () => {
  showDrawer.value = false;
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
    background-color: var(--background-color-dark);
    color: var(--text-primary);
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