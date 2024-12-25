<template>
  <FCDrawer title="Adicionar despesas" :on-before-close="Limpar()">
    <template #body>
      <el-form ref="formRef" :model="despesasDetails" :rules="rules" label-position="top" style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Nome" prop="nome">
              <el-input v-model="despesasDetails.nome" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Categoria" prop="categoria">
              <el-select v-model="despesasDetails.categoria" placeholder="Selecione...">
                <el-option v-for="item in ECategoriaOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Valor" prop="valor">
              <el-input v-model="despesasDetails.valor" :formatter="(value: string) => format(value, configInputMask)"
                :parser="(value: string) => unformat(value, configInputMask)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Conta" prop="contaId">
              <FCSelectContas v-model="despesaDetails.contaId" @update:model-value="updateConta" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Descrição" prop="descricao">
              <el-input v-model="despesasDetails.descricao" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Recorrente?" prop="recorrente">
              <el-select v-model="despesasDetails.recorrente" :options="ESelectOptions" placeholder="Selecione...">
                <el-option v-for="item in ESelectOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="despesasDetails.recorrente == '1'">
            <el-form-item label="Frequência" prop="frequencia">
              <el-select v-model="despesasDetails.frequencia" placeholder="Selecione...">
                <el-option v-for="item in EFrequenciaOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Vencimento" prop="vencimento">
              <el-date-picker v-model="despesasDetails.vencimento" format="DD/MM/YYYY" type="date" style="width: 100%"
                placeholder="Selecione a data" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
    </template>

    <template #FLeft>
      <el-button @click="Voltar">Cancel</el-button>
    </template>
    <template #FRight>
      <el-button type="primary" @click="handleCriar(formRef)">Salvar</el-button>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import FCDrawer from '@/shared/components/FCDrawer.vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { DespesasGatewayDi, type IDespesasGateway } from '../services/ports/DespesasGateway';
import { container } from '@/inversify.config';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import router from '@/core/router';
import { unformat, format } from 'v-money3';
import { DespesaInitialState, ECategoriaOptions, EFrequenciaOptions, ESelectOptions, type IDespesasModel } from '../types';
import { configInputMask } from '@/core/@types/types';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';

const formRef = ref<FormInstance>();

const despesasDetails = ref<IDespesasModel>({
  replicar: false,
  ano: 0,
  despesaId: '',
  mes: 0,
  contaId: '',
  id: '',
  nome: '',
  categoria: '',
  frequencia: '1',
  descricao: '',
  observacao: '',
  recorrente: '2',
  status: '2',
  valor: '0.00',
  vencimento: new Date()
});

const despesaDetails: IDespesasModel = reactive(DespesaInitialState);
const despesasGateway = container.get<IDespesasGateway>(DespesasGatewayDi);

const rules = reactive<FormRules<IDespesasModel>>({
  nome: [{ required: true, message: '', trigger: 'blur' }],
  valor: [{ required: true, message: '', trigger: 'blur', min: 1 }],
  recorrente: [{ required: true, message: '', trigger: 'blur' }],
  vencimento: [{ required: true, message: '', trigger: 'blur' }],
  status: [{ required: true, message: '', trigger: 'blur' }]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const updateConta = (id: string) => {
  despesaDetails.contaId = id
}

const salvarDespesas = async () => {
  const mes = new Date(despesasDetails.value.vencimento as string).getMonth()
  const ano = new Date(despesasDetails.value.vencimento as string).getFullYear()

  const response = await despesasGateway.criarDespesa({ ...despesasDetails.value, mes: mes, ano: ano });

  if (!response) return

  ElNotification({
    title: 'success',
    message: 'Despesa criada com sucesso.',
    type: 'success',
    duration: 2000
  })

  Limpar()
}

const handleCriar = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      await salvarDespesas()

      Voltar()
    }
  });
}

const Limpar = (() => {
  despesasDetails.value.id = ''
  despesasDetails.value.nome = ''
  despesasDetails.value.frequencia = '1'
  despesasDetails.value.descricao = ''
  despesaDetails.contaId = ''
  despesasDetails.value.observacao = ''
  despesasDetails.value.recorrente = '2'
  despesasDetails.value.status = '2'
  despesasDetails.value.valor = '0.00'
  despesasDetails.value.vencimento = new Date()
})

const Voltar = (() => {
  Limpar()
  router.push('/despesas')
  emits('handleFechar');
});

onMounted(() => {
  Limpar()
})

onUnmounted(() => {
  Limpar()
})
</script>

<style lang="scss" scoped></style>