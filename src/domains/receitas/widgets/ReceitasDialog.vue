<template>
  <FCDrawer :title="tituloDrawer" :on-before-close="Limpar" destroy-on-close>
    <template #body>
      <el-form ref="formRef" :model="receitaDetails" :rules="rules" label-position="top" style="width: 100%"
        v-loading="loading">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Nome" prop="nome">
              <el-input v-model="receitaDetails.nome" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6" style="display: flex; align-items: center;">
            <el-form-item label="Categoria" prop="categoria" style="width: 100%;">
              <FCSelectCategorias v-model="receitaDetails.categoria" :tipo="ETipoCategory.income"
                @update:model-value="updateCategoria" />
            </el-form-item>
            <el-form-item label=" ">
              <el-button :icon="Setting" style="margin: 6px 0 0 5px;" @click="showCategoriaList = true" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6" v-if="tipo == ETipoReceitaDrawer.criar">
            <el-form-item label="Lançamento" prop="tipoLancamento">
              <el-select v-model="receitaDetails.tipoLancamento" placeholder="Selecione...">
                <el-option v-for="item in ETipoOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6"
            v-if="receitaDetails.tipoLancamento == '2' || receitaDetails.tipoLancamento == '3' && tipo == ETipoReceitaDrawer.criar">
            <el-form-item label="Período" prop="range">
              <el-date-picker v-model="receitaDetails.range" type="monthrange" start-placeholder="Início"
                end-placeholder="fim" format="MM/YYYY" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item :label="receitaDetails.tipoLancamento == '2' ? 'Valor da Parcela' : 'Valor'" prop="valor">
              <el-input v-model="receitaDetails.valor" :formatter="(value: string) => format(value, configInputMask)"
                :parser="(value: string) => unformat(value, configInputMask)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Conta" prop="contaId">
              <FCSelectContas v-model="receitaDetails.contaId" @update:model-value="updateConta" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Descrição" prop="descricao">
              <el-input v-model="receitaDetails.descricao" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item :label="receitaDetails.tipoLancamento == '3' ? 'Dia do recebimento' : 'Recebimento'"
              prop="recebimento">
              <el-date-picker v-model="receitaDetails.recebimento" format="DD/MM/YYYY" type="date" style="width: 100%"
                placeholder="Selecione a data" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6">
            <el-form-item label="Pago" prop="status">
              <el-select v-model="receitaDetails.status" :options="ESelectOptions" placeholder="Selecione...">
                <el-option v-for="item in ESelectOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Observação" prop="observacao">
              <el-input v-model="receitaDetails.observacao" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <CategoriasList v-model="showCategoriaList" v-if="showCategoriaList" :tipo="ETipoCategory.income" />
    </template>

    <template #FLeft>
      <el-button @click="Voltar">Cancel</el-button>
    </template>
    <template #FRight>
      <el-button type="primary" @click="handleReceita(formRef)" :loading="loading">Salvar</el-button>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import FCDrawer from '@/shared/components/FCDrawer.vue';
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import { container } from '@/inversify.config';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import router from '@/core/router';
import { unformat, format } from 'v-money3';
import { ReceitasGatewayDi, type ReceitaInputDto, type ReceitasGateway } from '../services/ports/ReceitasGateway';
import { ESelectOptions, ETipoOptions } from '@/domains/despesas/types';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';
import { ETipoReceitaDrawer } from '../types';
import { configInputMask } from '@/core/@types/types';
import FCSelectCategorias from '@/shared/components/FCSelectCategorias.vue';
import { ETipoCategory } from '@/core/@types/enums';
import {
  Setting
} from '@element-plus/icons-vue';
import CategoriasList from '@/shared/components/categorias/CategoriasList.vue';

interface IProps {
  receita: ReceitaInputDto | undefined
  tipo: ETipoReceitaDrawer
}

const loading = ref(false)

const showCategoriaList = ref(false)

const props = defineProps<IProps>()

const tituloDrawer = computed(() => props.tipo == ETipoReceitaDrawer.criar ? 'Adicionar receita' : 'Editar receita')

const formRef = ref<FormInstance>();

const receitaDetails = ref<ReceitaInputDto>({
  replicar: false,
  ano: 0,
  incomeId: '',
  mes: 0,
  id: '',
  nome: '',
  categoria: '',
  tipoLancamento: '1',
  range: ['', ''],
  descricao: '',
  observacao: '',
  status: '2',
  valor: '0.00',
  recebimento: new Date(),
  contaId: ''
});

const receitasGateway = container.get<ReceitasGateway>(ReceitasGatewayDi);

const updateCategoria = (val: string) => {
  receitaDetails.value.categoria = val
}

const rules = reactive<FormRules<ReceitaInputDto>>({
  nome: [{ required: true, message: '', trigger: 'blur' }],
  valor: [{ required: true, message: '', trigger: 'blur', min: 1 }],
  recebimento: [{ required: true, message: '', trigger: 'blur' }],
  status: [{ required: true, message: '', trigger: 'blur' }]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const updateConta = (id: string) => {
  if (ETipoReceitaDrawer.editar) return

  receitaDetails.value.contaId = id
}

const criarReceita = async () => {
  try {
    loading.value = true

    const mes = receitaDetails.value.recebimento ? new Date(receitaDetails.value.recebimento).getMonth() + 1 : 0
    const ano = receitaDetails.value.recebimento ? new Date(receitaDetails.value.recebimento).getFullYear() : 0

    const response = await receitasGateway.criar({ ...receitaDetails.value, mes: mes, ano: ano });

    if (!response) return

    ElNotification({
      title: 'success',
      message: 'Receita criada com sucesso.',
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

const editarReceita = async () => {
  try {
    loading.value = true

    const response = await receitasGateway.editar(receitaDetails.value)

    if (response?.statusCode != 200) return ElNotification({
      title: 'error',
      message: response?.message || 'Erro ao editar receita',
      type: 'success',
      duration: 2000
    })

    ElNotification({
      title: 'success',
      message: 'Receita editada com sucesso.',
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

const handleReceita = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      if (props.tipo == ETipoReceitaDrawer.criar) await criarReceita()

      if (props.tipo == ETipoReceitaDrawer.editar) await editarReceita()

      Voltar()
    }
  });
}

const Limpar = (() => {
  receitaDetails.value.id = ''
  receitaDetails.value.nome = ''
  receitaDetails.value.descricao = ''
  receitaDetails.value.observacao = ''
  receitaDetails.value.contaId = ''
  receitaDetails.value.status = '2'
  receitaDetails.value.valor = '0.00'
  receitaDetails.value.recebimento = new Date()
})

const Voltar = (() => {
  Limpar()
  router.push('/receitas')
  emits('handleFechar');
});

const preencher = (data: ReceitaInputDto | undefined) => {
  receitaDetails.value.id = data?.id || '';
  receitaDetails.value.status = data?.status || '2';
  receitaDetails.value.ano = data?.ano || 0;
  receitaDetails.value.nome = data?.nome || '';
  receitaDetails.value.mes = data?.mes || 0;
  receitaDetails.value.descricao = data?.descricao || '';
  receitaDetails.value.categoria = data?.categoria || '';
  receitaDetails.value.replicar = data?.replicar || false;
  receitaDetails.value.valor = data?.valor ? Number(data?.valor).toFixed(2) : '0'
  receitaDetails.value.recebimento = data?.recebimento || undefined;
  receitaDetails.value.contaId = data?.contaId || '';
  receitaDetails.value.incomeId = data?.incomeId || '';
  receitaDetails.value.observacao = data?.observacao || '';
  receitaDetails.value.tipoLancamento = data?.tipoLancamento || '1'
  receitaDetails.value.range = [
    data?.range?.[0] || undefined,
    data?.range?.[1] || undefined,
  ];
};

watch(
  () => props.receita,
  (newValue) => {
    if (newValue) {
      preencher(newValue);
    } else if (props.tipo === ETipoReceitaDrawer.criar) {
      preencher(undefined);
    }
  },
  { immediate: true }
);

watchEffect(() => {
  const isTipoLancamentoRecorrente = receitaDetails.value.tipoLancamento === '3';

  if (isTipoLancamentoRecorrente) {
    const primeiroMesDoAno = new Date(new Date().getFullYear(), 0, 1);
    const ultimoMesDoAno = new Date(new Date().getFullYear(), 11, 31);

    receitaDetails.value.range = [primeiroMesDoAno.toString(), ultimoMesDoAno.toString()]; // Definir como array
  } else {
    receitaDetails.value.range = ['', '']
  }
});

onMounted(() => {
  Limpar()
})

onUnmounted(() => {
  Limpar()
})
</script>

<style lang="scss">
// .date-picker-custom .el-date-picker__header {
//   display: none !important;
// }</style>