<template>
  <el-row>
    <el-col class="container_page" :xs="24" :md="20">
      <el-row class="body">
        <el-col :span="24" style="margin: 0.5rem 0 1rem;">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="8">
              <BreadCrumb name="Despesas" icon="💸" />
            </el-col>
            <el-col class="hidden-sm-and-down" span="auto"
              style="margin: 0; padding: 0; display: flex; align-items: center;">
              <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
            </el-col>
            <el-col :span="8" style="display: flex;flex-wrap: wrap; justify-content: flex-end;">
              <FCButtonIcon type="primary" circle v-on:handle-click="adicionarDespesa" :icon="Plus" />
            </el-col>
          </el-row>
        </el-col>
        <el-col class="hidden-sm-and-up" :span="24"
          style="margin: 0.5rem 0 1rem; padding: 0; display: flex; align-items: center;    justify-content: center;">
          <DatePeriodoPicker v-on:update:month-change="handlePeriodo" />
        </el-col>
        <el-col :span="24">
          <TableFilterableFrame :Loading="loading" v-on:handle-editar="editarDespesa"
            v-on:handle-deletar="deletarDespesa" :produtos="perPeriodlistaDeDespesas">
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
              <el-table-column label="Vencimento" prop="vencimento" width="150" sortable>
                <template v-slot="scope">
                  {{ formatDate(scope.row.vencimento) }}
                </template>
              </el-table-column>
            </template>
          </TableFilterableFrame>
        </el-col>
      </el-row>
    </el-col>
    <el-col class="hidden-sm-and-down" :span="4">
      <ResumoLateral :loading="loading" label="Total despesas" :total="totalDeDespesas" :totalPago="totalPago"
        :totalPendente="totalPendente">
        <template #header_total>
          <h4>Total Despesas</h4>
        </template>
        <template #header_pago>
          <h4>Total Pago</h4>
        </template>
        <template #header_pendente>
          <h4>Total Pendente</h4>
        </template>
      </ResumoLateral>
    </el-col>
  </el-row>
  <DespesasDialog v-model="showDrawer" v-on:handle-fechar="handleFecharDrawer" :despesa="Despesa" :tipo="tipoDrawer" />
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, reactive } from "vue";
import { formatCurrency, formatDate } from "@/core/utils/utils";
import { container } from "@/inversify.config";
import {
  Plus
} from '@element-plus/icons-vue';
import { ElMessageBox, ElNotification } from "element-plus";
import DatePeriodoPicker from "@/shared/components/DatePeriodoPicker.vue";
import BreadCrumb from "@/shared/components/BreadCrumb.vue";
import FCButtonIcon from "@/shared/components/buttons/Criar/FCButtonIcon.vue";
import TableFilterableFrame from "@/shared/components/TableFilterableFrame.vue";
import ResumoLateral from "@/shared/components/ResumoLateral.vue";
import { CategoriasGatewayDi, type CategoriasGateway } from "@/core/services/ports/CategoriasGateway";
import { ETipoCategory } from "@/core/@types/enums";
import { useCategoriasStore } from "@/core/store/categoriasStore/useCategoriasStore";
import { storeToRefs } from "pinia";
import DespesasDialog from "./widgets/DespesasDialog.vue";
import { DespesaInitialState, ETipoDespesaDrawer, type IDespesas, type IDespesasModel } from "./types";
import useFinanceHandler from "./composables/useFinanceHandler";
import { DespesasGatewayDi, type IDespesasGateway } from "./services/ports/DespesasGateway";
import { DespesaFactoryDi, type IDespesaFactory } from "./DespesaFactory";
import IconInsideTable from "./components/IconInsideTable.vue";

const loading = ref(false);
const showDrawer = ref(false);

const Despesa = ref<IDespesasModel | undefined>(DespesaInitialState);

const tipoDrawer = ref<ETipoDespesaDrawer>(ETipoDespesaDrawer.criar);

const listaDeDespesas = ref<IDespesas[]>([]);

const perPeriodlistaDeDespesas = ref<IDespesasModel[] | undefined>([]);

const financeHandler = useFinanceHandler();
const despesasGateway = container.get<IDespesasGateway>(DespesasGatewayDi);
const despesasFactory = container.get<IDespesaFactory>(DespesaFactoryDi);

const categoriasGateway = container.get<CategoriasGateway>(CategoriasGatewayDi);

const categoriasStore = useCategoriasStore()
const { categoriasList } = storeToRefs(categoriasStore)

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

const formatCollumnNumber = (row: IDespesasModel) => {
  const valor = row.valor;

  return formatCurrency(valor)
}

const totalDeDespesas = computed(() => {
  return financeHandler.obterTotal(perPeriodlistaDeDespesas?.value || [])
})

const totalPago = computed(() => {
  const findDespesasPagas = perPeriodlistaDeDespesas?.value?.filter(despesa => {
    if (despesa.status == '1') {
      return despesa
    }
  })

  return financeHandler.obterTotal(findDespesasPagas || [])
})

const totalPendente = computed(() => {
  const despesas = perPeriodlistaDeDespesas.value;

  const findDespesasPagas = despesas?.filter(despesa => {
    if (despesa.status == '2') {
      return despesa
    }
  })

  return financeHandler.obterTotal(findDespesasPagas || [])
})

const adicionarDespesa = () => {
  tipoDrawer.value = ETipoDespesaDrawer.criar
  Despesa.value = undefined
  showDrawer.value = true
}

const editarDespesa = ((id: unknown) => {
  tipoDrawer.value = ETipoDespesaDrawer.editar

  Despesa.value = undefined

  const despesaSelecionada = listaDeDespesas.value?.find((receita) => receita.id === id);

  if (!despesaSelecionada) return ElNotification({
    title: 'error',
    message: 'erro ao selecionar',
    type: 'error',
    duration: 2000
  })

  if (despesaSelecionada.meses && despesaSelecionada.meses?.length <= 0) return ElNotification({
    title: 'error',
    message: 'erro ao selecionar',
    type: 'error',
    duration: 2000
  })

  const getMonth = despesaSelecionada.meses && despesaSelecionada.meses[0] || undefined;

  if (!getMonth) return ElNotification({
    title: 'error',
    message: 'erro ao selecionar',
    type: 'error',
    duration: 2000
  })

  Despesa.value = {
    ...despesaSelecionada,
    ...getMonth
  }

  showDrawer.value = true
})

const handleFecharDrawer = (async () => {
  showDrawer.value = false;
  Despesa.value = DespesaInitialState
  await obterDespesas()
})

const deletarDespesa = async (row: IDespesasModel, multiplos?: boolean) => {
  try {
    if (!row.id) return ElNotification({
      title: 'Erro',
      message: 'Erro ao selecionar a despesa',
      type: 'error',
      duration: 5000
    })

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

    loading.value = true

    const response = await despesasGateway.excluirDespesa(row.id, multiplos ? undefined : row.mes);

    if (!response) return ElNotification({
      title: 'Erro',
      message: 'Erro ao deletar a despesa',
      type: 'error',
      duration: 5000
    })

    ElNotification({
      title: 'success',
      message: 'Despesa deletada com sucesso',
      type: 'success',
      duration: 5000
    })

    await obterDespesas();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false
  }
}

const obterDespesas = async () => {
  try {
    loading.value = true

    const response = await despesasGateway.obterDespesas(periodo.mes, periodo.ano);

    if (response?.statusCode != 200) {

      listaDeDespesas.value = []
      perPeriodlistaDeDespesas.value = []

      return
    }

    listaDeDespesas.value = response.result || [];

    if (listaDeDespesas.value) {
      perPeriodlistaDeDespesas.value = despesasFactory.create(listaDeDespesas.value)
    } else {
      listaDeDespesas.value = []
    }

    await categoriasStore.fetchCategoriasLista(ETipoCategory.expense)
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
  await obterDespesas()
}

const obterCategorias = async () => {
  const response = await categoriasGateway.obter({ tipo: ETipoCategory.expense })

  if (response?.statusCode != 200) return

  categoriasList.value = response.result || []
}

onMounted(() => {
  obterDespesas();
  obterCategorias()
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
}

.table-icon-status {
  font-size: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 4px;
}

.custom-label {
  padding: 0 5px;
  text-align: center;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  color: #fff;
}
</style>