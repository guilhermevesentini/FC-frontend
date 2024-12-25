<template>
  <FCDrawer title="Editar despesas" :on-before-close="Limpar">
    <template #body>
      <el-form ref="formRef" :model="despesa" :rules="rules" label-position="top" style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Nome" prop="nome">
              <el-input v-model="despesa.nome" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Descrição" prop="descricao">
              <el-input v-model="despesa.descricao" placeholder="Digite aqui" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Categoria" prop="categoria">
              <el-select v-model="despesa.categoria" placeholder="Selecione...">
                <el-option v-for="item in ECategoriaOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Valor" prop="valor">
              <el-input v-model="despesa.valor" :formatter="(value: string) => format(value, configInputMask)"
                :parser="(value: string) => unformat(value, configInputMask)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Conta" prop="contaId">
              <FCSelectContas v-model="despesa.contaId" @update:model-value="updateConta" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Recorrente?" prop="recorrente">
              <el-select v-model="despesa.recorrente" :options="ESelectOptions" placeholder="Selecione...">
                <el-option v-for="item in ESelectOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="despesa.recorrente == '1'">
            <el-form-item label="Frequência" prop="frequencia">
              <el-select v-model="despesa.frequencia" placeholder="Selecione...">
                <el-option v-for="item in EFrequenciaOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Vencimento" prop="vencimento">
              <el-date-picker v-model="despesa.vencimento" format="DD/MM/YYYY" type="date" style="width: 100%"
                placeholder="Selecione a data" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Pago" prop="status">
              <el-select v-model="despesa.status" :options="ESelectOptions" placeholder="Selecione...">
                <el-option v-for="item in ESelectOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="replicar">
              <el-checkbox v-model="despesa.replicar" label="Replicar alteração para outros meses?" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Observação" prop="observacao">
              <el-input v-model="despesa.observacao" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <template #FLeft>
      <el-button @click="Voltar">Cancel</el-button>
    </template>
    <template #FRight>
      <el-button type="primary" @click="handleSalvar(formRef)">Salvar</el-button>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import FCDrawer from '@/shared/components/FCDrawer.vue';
import { onMounted, reactive, ref, watchEffect } from 'vue';
import { container } from '@/inversify.config';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import router from '@/core/router';
import { unformat, format } from 'v-money3';
import { DespesaInitialState, ECategoriaOptions, EFrequenciaOptions, ESelectOptions, type IDespesasModel } from '../types';
import { DespesasGatewayDi, type IDespesasGateway } from '../services/ports/DespesasGateway';
import { configInputMask } from '@/core/@types/types';
import FCSelectContas from '@/shared/components/FCSelectContas.vue';

interface IProps {
  despesa: IDespesasModel
}

const props = defineProps<IProps>()

const formRef = ref<FormInstance>();

const despesa = ref<IDespesasModel>({ ...DespesaInitialState });

const despesasGateway = container.get<IDespesasGateway>(DespesasGatewayDi);

const rules = reactive<FormRules<IDespesasModel>>({
  nome: [{ required: true, message: '', trigger: 'blur' }],
  valor: [{ required: true, message: '', trigger: 'blur', min: 0 }],
  recorrente: [{ required: true, message: '', trigger: 'blur' }],
  vencimento: [{ required: true, message: '', trigger: 'blur' }],
  status: [{ required: true, message: '', trigger: 'blur' }]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const updateConta = (id: string) => {
  despesa.value.contaId = id
}

const Salvar = (async () => {
  const response = await despesasGateway.editarDespesas(despesa.value);

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

  Voltar()
})

const handleSalvar = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      await Salvar()
    }
  });
}

const preencher = (data: IDespesasModel | undefined) => {
  if (!data) return;
  despesa.value.id = data.id || '';
  despesa.value.status = data.status || '2';
  despesa.value.ano = data.ano || 0;
  despesa.value.nome = data.nome || '';
  despesa.value.mes = data.mes || 0;
  despesa.value.descricao = data.descricao || '';
  despesa.value.categoria = data.categoria || '';
  despesa.value.replicar = data.replicar || false;
  despesa.value.valor = data.valor || '0.00';
  despesa.value.recorrente = data.recorrente || '';
  despesa.value.vencimento = data.vencimento || undefined;
  //despesa.value.contaId = data.contaId || '';
  despesa.value.despesaId = data.despesaId || '';
  despesa.value.frequencia = data.frequencia || '';
  despesa.value.observacao = data.observacao || '';
};

const Limpar = () => {
  despesa.value.id = ''
  despesa.value.status = ''
  despesa.value.ano = 0
  despesa.value.nome = ''
  despesa.value.mes = 0
  despesa.value.descricao = ''
  despesa.value.categoria = ''
  despesa.value.replicar = false
  despesa.value.valor = '0.00'
  despesa.value.recorrente = ''
  despesa.value.vencimento = undefined
  //despesa.value.contaId = ''
  despesa.value.despesaId = ''
  despesa.value.frequencia = ''
  despesa.value.observacao = ''
}

const Voltar = (() => {
  Limpar()
  router.push('/despesas')
  emits('handleFechar');
});

watchEffect(() => {
  if (props.despesa) {
    preencher(props.despesa);
  }
});
</script>

<style lang="scss" scoped></style>