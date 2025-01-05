<template>
  <FCDrawer :title="tituloDrawer" :on-before-close="Limpar" destroy-on-close>
    <template #body>
      <el-form ref="formRef" :model="despesasDetails" :rules="rules" label-position="top" style="width: 100%"
        v-loading="loading">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Nome" prop="nome">
              <el-input v-model="despesasDetails.nome" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6" style="display: flex; align-items: center;">
            <el-form-item label="Categoria" prop="categoria" style="width: 100%;">
              <el-select v-model="despesasDetails.categoria" placeholder="Selecione...">
                <el-option v-for="item in ECategoriaOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" ">
              <el-button :icon="Plus" style="margin: 6px 0 0 5px;" @click="showCategoriaList = true" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6" v-if="tipo == ETipoDespesaDrawer.criar">
            <el-form-item label="Lançamento" prop="tipoLancamento">
              <el-select v-model="despesasDetails.tipoLancamento" placeholder="Selecione...">
                <el-option v-for="item in ETipoOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6"
            v-if="despesasDetails.tipoLancamento == '2' && tipo == ETipoDespesaDrawer.criar">
            <el-form-item label="Meses" prop="range">
              <el-date-picker v-model="despesasDetails.range" type="monthrange" start-placeholder="Início"
                end-placeholder="fim" format="MM/YYYY" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item :label="despesasDetails.tipoLancamento == '2' ? 'Valor da Parcela' : 'Valor'" prop="valor">
              <el-input v-model="despesasDetails.valor" :formatter="(value: string) => format(value, configInputMask)"
                :parser="(value: string) => unformat(value, configInputMask)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Conta" prop="contaId">
              <FCSelectContas v-model="despesasDetails.contaId" @update:model-value="updateConta" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Descrição" prop="descricao">
              <el-input v-model="despesasDetails.descricao" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Vencimento" prop="vencimento">
              <el-date-picker v-model="despesasDetails.vencimento" format="DD/MM/YYYY" type="date" style="width: 100%"
                placeholder="Selecione a data" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Pago" prop="status">
              <el-select v-model="despesasDetails.status" :options="ESelectOptions" placeholder="Selecione...">
                <el-option v-for="item in ESelectOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Observação" prop="observacao">
              <el-input v-model="despesasDetails.observacao" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <CategoriasList v-model="showCategoriaList" v-if="showCategoriaList" />
    </template>
    <template #FLeft>
      <el-button @click="Voltar">Cancel</el-button>
    </template>
    <template #FRight>
      <el-button type="primary" @click="handleCriar(formRef)" :loading="loading">Salvar</el-button>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import FCDrawer from '@/shared/components/FCDrawer.vue';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { DespesasGatewayDi, type IDespesasGateway } from '../services/ports/DespesasGateway';
import { container } from '@/inversify.config';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import router from '@/core/router';
import { unformat, format } from 'v-money3';
import { ECategoriaOptions, ESelectOptions, ETipoDespesaDrawer, ETipoOptions, type IDespesasModel } from '../types';
import { configInputMask } from '@/core/@types/types';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';
import {
  Plus
} from '@element-plus/icons-vue';
import CategoriasList from '@/shared/components/categorias/CategoriasList.vue';

interface IProps {
  despesa: IDespesasModel | undefined
  tipo: ETipoDespesaDrawer
}

const loading = ref(false)

const showCategoriaList = ref(false)

const props = defineProps<IProps>()

const tituloDrawer = computed(() => props.tipo == ETipoDespesaDrawer.criar ? 'Adicionar despesa' : 'Editar despesa')

const formRef = ref<FormInstance>();

const despesasDetails = ref<IDespesasModel>({
  replicar: false,
  ano: 0,
  despesaId: '',
  mes: 0,
  id: '',
  nome: '',
  categoria: '',
  descricao: '',
  observacao: '',
  tipoLancamento: '1',
  range: undefined,
  status: '2',
  valor: '0.00',
  vencimento: undefined,
  contaId: '',
});

const despesasGateway = container.get<IDespesasGateway>(DespesasGatewayDi);

const rules = reactive<FormRules<IDespesasModel>>({
  nome: [{ required: true, message: '', trigger: 'blur' }],
  valor: [{ required: true, message: '', trigger: 'blur', min: 1 }],
  vencimento: [{ required: true, message: '', trigger: 'blur' }],
  status: [{ required: true, message: '', trigger: 'blur' }]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const updateConta = (id: string) => {
  despesasDetails.value.contaId = id
}

const criarDespesas = async () => {
  try {
    loading.value = true

    const mes = despesasDetails.value.vencimento ? new Date(despesasDetails.value.vencimento).getMonth() + 1 : 0
    const ano = despesasDetails.value.vencimento ? new Date(despesasDetails.value.vencimento).getFullYear() : 0

    const response = await despesasGateway.criarDespesa({ ...despesasDetails.value, mes: mes, ano: ano });

    if (!response) return

    ElNotification({
      title: 'success',
      message: 'Despesa criada com sucesso.',
      type: 'success',
      duration: 2000
    })

    Limpar()
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const editarDespesa = (async () => {
  try {
    loading.value = true

    const response = await despesasGateway.editarDespesas(despesasDetails.value);

    if (!response) return ElNotification({
      title: 'Error',
      message: 'Erro ao salvar suas alterações, tente novamente.',
      type: 'error',
      duration: 2000
    })

    ElNotification({
      title: 'success',
      message: 'Despesa foi salva com sucesso.',
      type: 'success',
      duration: 2000
    })

    Limpar()
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
})

const handleCriar = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      if (props.tipo == ETipoDespesaDrawer.criar) await criarDespesas()

      if (props.tipo == ETipoDespesaDrawer.editar) await editarDespesa()

      Voltar()
    }
  });
}

const Limpar = (() => {
  despesasDetails.value.id = ''
  despesasDetails.value.nome = ''
  despesasDetails.value.tipoLancamento = '1'
  despesasDetails.value.range = undefined
  despesasDetails.value.descricao = ''
  despesasDetails.value.contaId = ''
  despesasDetails.value.observacao = ''
  despesasDetails.value.status = '2'
  despesasDetails.value.valor = '0.00'
  despesasDetails.value.vencimento = new Date()
})

const Voltar = (() => {
  Limpar()
  router.push('/despesas')
  emits('handleFechar');
});

const preencher = (data: IDespesasModel | undefined) => {
  despesasDetails.value.id = data?.id || '';
  despesasDetails.value.status = data?.status || '2';
  despesasDetails.value.ano = data?.ano || 0;
  despesasDetails.value.nome = data?.nome || '';
  despesasDetails.value.mes = data?.mes || 0;
  despesasDetails.value.valor = data?.valor ? Number(data?.valor).toFixed(2) : '0';
  despesasDetails.value.descricao = data?.descricao || '';
  despesasDetails.value.categoria = data?.categoria || '';
  despesasDetails.value.replicar = data?.replicar || false;
  despesasDetails.value.tipoLancamento = data?.tipoLancamento || '1';
  despesasDetails.value.vencimento = data?.vencimento || undefined;
  despesasDetails.value.contaId = data?.contaId || '';
  despesasDetails.value.despesaId = data?.despesaId || '';
  despesasDetails.value.observacao = data?.observacao || '';
  despesasDetails.value.range && despesasDetails.value.range.inicio ? despesasDetails.value.range.inicio = data?.range?.inicio || undefined : {}
  despesasDetails.value.range && despesasDetails.value.range.fim ? despesasDetails.value.range.fim = data?.range?.fim || undefined : {}
};

watch(
  () => props.despesa,
  (newValue) => {
    if (newValue) {
      preencher(newValue);
    } else if (props.tipo === ETipoDespesaDrawer.criar) {
      preencher(undefined);
    }
  },
  { immediate: true }
);

onMounted(() => {
  Limpar()
})

onUnmounted(() => {
  Limpar()
})
</script>

<style lang="scss" scoped></style>