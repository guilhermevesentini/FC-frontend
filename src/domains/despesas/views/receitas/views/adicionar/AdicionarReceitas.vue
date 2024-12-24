<template>
  <FCDrawer title="Adicionar receitas" :on-before-close="Limpar()">
    <template #body>
      <el-form ref="formRef" :model="receitaDetails" :rules="rules" label-position="top" style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Nome" prop="nome">
              <el-input v-model="receitaDetails.nome" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Categoria" prop="categoria">
              <el-select v-model="receitaDetails.categoria" placeholder="Selecione...">
                <el-option v-for="item in ECategoriaReceitasOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Valor" prop="valor">
              <el-input v-model="receitaDetails.valor" :formatter="(value: string) => format(value, config)"
                :parser="(value: string) => unformat(value, config)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Conta" prop="contaId">
              <FCSelectContas v-model="receitaDetails.contaId" @update:model-value="updateConta" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Descrição" prop="descricao">
              <el-input v-model="receitaDetails.descricao" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Recorrente?" prop="recorrente">
              <el-select v-model="receitaDetails.recorrente" :options="ESelectOptions" placeholder="Selecione...">
                <el-option v-for="item in ESelectOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="receitaDetails.recorrente == '1'">
            <el-form-item label="Frequência" prop="frequencia">
              <el-select v-model="receitaDetails.frequencia" placeholder="Selecione...">
                <el-option v-for="item in EFrequenciaOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Recebimento" prop="recebimento">
              <el-date-picker v-model="receitaDetails.recebimento" format="DD/MM/YYYY" type="date" style="width: 100%"
                placeholder="Selecione a data" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
import { container } from '@/inversify.config';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import router from '@/core/router';
import { unformat, format } from 'v-money3';
import { ReceitasGatewayDi, type ReceitaInputDto, type ReceitasGateway } from '../../services/ports/ReceitasGateway';
import { ECategoriaReceitasOptions, ReceitasInitialState } from '../../types';
import { EFrequenciaOptions, ESelectOptions } from '@/domains/despesas/types';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';

const formRef = ref<FormInstance>();

const receitaDetails = ref<ReceitaInputDto>({
  replicar: false,
  ano: 0,
  incomeId: '',
  mes: 0,
  id: '',
  nome: '',
  categoria: '',
  frequencia: '1',
  descricao: '',
  observacao: '',
  recorrente: '2',
  status: '2',
  valor: '0.00',
  recebimento: new Date(),
  contaId: ''
});

const config = {
  masked: false,
  precision: 2,
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
};

const despesaDetails: ReceitaInputDto = reactive(ReceitasInitialState);

const receitasGateway = container.get<ReceitasGateway>(ReceitasGatewayDi);

const rules = reactive<FormRules<ReceitaInputDto>>({
  nome: [{ required: true, message: '', trigger: 'blur' }],
  valor: [{ required: true, message: '', trigger: 'blur', min: 1 }],
  recorrente: [{ required: true, message: '', trigger: 'blur' }],
  recebimento: [{ required: true, message: '', trigger: 'blur' }],
  status: [{ required: true, message: '', trigger: 'blur' }]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const updateConta = (id: string) => {
  receitaDetails.value.contaId = id
}

const salvarReceitas = async () => {
  const mes = new Date(receitaDetails.value.recebimento).getMonth()
  const ano = new Date(receitaDetails.value.recebimento).getFullYear()

  const response = await receitasGateway.criar({ ...receitaDetails.value, mes: mes, ano: ano });

  if (!response) return

  ElNotification({
    title: 'success',
    message: 'Receita criada com sucesso.',
    type: 'success',
    duration: 2000
  })

  Limpar()
}

const handleCriar = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      await salvarReceitas()

      Voltar()
    }
  });
}

const Limpar = (() => {
  receitaDetails.value.id = ''
  receitaDetails.value.nome = ''
  receitaDetails.value.frequencia = '1'
  receitaDetails.value.descricao = ''
  receitaDetails.value.observacao = ''
  receitaDetails.value.recorrente = '2'
  receitaDetails.value.status = '2'
  receitaDetails.value.valor = '0.00'
  receitaDetails.value.recebimento = new Date()
})

const Voltar = (() => {
  Limpar()
  router.push('/Despesas/receitas')
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