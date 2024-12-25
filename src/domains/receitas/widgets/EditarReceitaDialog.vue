<template>
  <FCDrawer title="Editar receita" :on-before-close="Limpar">
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
              <el-input v-model="receitaDetails.valor" :formatter="(value: string) => format(value, configInputMask)"
                :parser="(value: string) => unformat(value, configInputMask)"></el-input>
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
      <el-button type="primary" @click="handleEditar(formRef)">Salvar</el-button>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import { ReceitasGatewayDi, type ReceitaInputDto, type ReceitasGateway } from '../services/ports/ReceitasGateway';
import { ECategoriaReceitasOptions, ReceitasInitialState } from '../types';
import { EFrequenciaOptions, ESelectOptions } from '@/domains/despesas/types';
import router from '@/core/router';
import type { FormInstance, FormRules } from 'element-plus';
import { container } from '@/inversify.config';
import { format, unformat } from 'v-money3';
import { configInputMask } from '@/core/@types/types';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';
import FCDrawer from '@/shared/components/FCDrawer.vue';

interface IProps {
  receita: ReceitaInputDto | undefined
}

const props = defineProps<IProps>()

const formRef = ref<FormInstance>();

const receitaDetails = ref<ReceitaInputDto>({ ...ReceitasInitialState });

const receitasGateway = container.get<ReceitasGateway>(ReceitasGatewayDi);

const rules = reactive<FormRules<ReceitaInputDto>>({
  nome: [{ required: true, message: '', trigger: 'blur' }],
  valor: [{ required: true, message: '', trigger: 'blur', min: 0 }],
  recorrente: [{ required: true, message: '', trigger: 'blur' }],
  recebimento: [{ required: true, message: '', trigger: 'blur' }],
  status: [{ required: true, message: '', trigger: 'blur' }]
});

const updateConta = (id: string) => {
  receitaDetails.value.contaId = id
}

const preencher = (data: ReceitaInputDto | undefined) => {
  if (!data) return;
  receitaDetails.value.id = data.id || '';
  receitaDetails.value.status = data.status || '2';
  receitaDetails.value.ano = data.ano || 0;
  receitaDetails.value.nome = data.nome || '';
  receitaDetails.value.mes = data.mes || 0;
  receitaDetails.value.descricao = data.descricao || '';
  receitaDetails.value.categoria = data.categoria || '';
  receitaDetails.value.replicar = data.replicar || false;
  receitaDetails.value.valor = data.valor || '0.00';
  receitaDetails.value.recorrente = data.recorrente || '';
  receitaDetails.value.recebimento = data.recebimento || undefined;
  receitaDetails.value.contaId = data.contaId || '';
  receitaDetails.value.incomeId = data.incomeId || '';
  receitaDetails.value.frequencia = data.frequencia || '';
  receitaDetails.value.observacao = data.observacao || '';
};


const Limpar = () => {
  receitaDetails.value.id = ''
  receitaDetails.value.status = ''
  receitaDetails.value.ano = 0
  receitaDetails.value.nome = ''
  receitaDetails.value.mes = 0
  receitaDetails.value.descricao = ''
  receitaDetails.value.categoria = ''
  receitaDetails.value.replicar = false
  receitaDetails.value.valor = '0.00'
  receitaDetails.value.recorrente = ''
  receitaDetails.value.recebimento = undefined
  receitaDetails.value.contaId = ''
  receitaDetails.value.incomeId = ''
  receitaDetails.value.frequencia = ''
  receitaDetails.value.observacao = ''
}

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const Voltar = (() => {
  Limpar()
  router.push('/receitas')
  emits('handleFechar');
});

const handleEditar = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      await salvar()

      Voltar()
    }
  });
}

const salvar = async () => {
  const response = await receitasGateway.editar(receitaDetails.value)

  if (response?.statusCode != 200) return alert('ERRO')

  Voltar()
}

watchEffect(() => {
  if (props.receita) {
    preencher(props.receita);
  }
});
</script>

<style lang="scss" scoped></style>