<template>
  <el-drawer class="adicionar_conta_drawer" size="600px" height="100%" :on-before-close="handleLimpar()">
    <template #header="{ close, titleId, titleClass }">
      <h4>Adicionar conta</h4>
    </template>
    <el-form ref="formRef" :model="contaDetails" :rules="rules" label-position="top" style="width: 100%">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Banco" prop="nome">
            <el-select v-model="contaDetails.nome" placeholder="Selecione...">
              <el-option v-for="item in EListaBancosOpt" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Proprietário" prop="usuario">
            <el-input v-model="contaDetails.usuario" placeholder="Digite aqui" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Agência" prop="agencia">
            <el-input v-model="contaDetails.agencia" placeholder="Digite aqui" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Conta" prop="conta">
            <el-input v-model="contaDetails.conta" placeholder="Digite aqui" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Saldo" prop="saldo">
            <el-input v-model="contaDetails.saldo" :formatter="(value: string) => format(value, config)"
              :parser="(value: string) => unformat(value, config)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleVoltar">Cancel</el-button>
      <el-button type="primary" @click="handleCriar(formRef)">Salvar</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { unformat, format } from 'v-money3';
import type { FormInstance, FormRules } from 'element-plus';
import { container } from '@/inversify.config';
import { ContasGatewayDi, type ContaOutputto, type ContasGateway } from '../../services/ports/ContasGateway';

const contasGateway = container.get<ContasGateway>(ContasGatewayDi);

const config = {
  masked: false,
  precision: 2,
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
};

const EListaBancosOpt = [
  { label: 'Nubank', value: '1', color: "#7a3be1" },
  { label: 'Banco do Brasil', value: '2', color: "#006bb3" },
];

const contaDetails = reactive<ContaOutputto>({
  agencia: '',
  conta: '',
  id: '',
  nome: '',
  saldo: '',
  usuario: ''
})

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<ContaOutputto>>({
  nome: [{ required: true, message: '', trigger: 'blur' }],
  agencia: [{ required: true, message: '', trigger: 'blur', min: 3 }],
  conta: [{ required: true, message: '', trigger: 'blur' }],
  usuario: [{ required: true, message: '', trigger: 'blur' }],
  saldo: [{ required: true, message: '', trigger: 'blur' }]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const handleLimpar = () => {
  contaDetails.agencia = ''
  contaDetails.conta = ''
  contaDetails.nome = ''
  contaDetails.saldo = ''
  contaDetails.usuario = ''
  contaDetails.id = ''
}

const handleCriar = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      const response = await contasGateway.criar(contaDetails);

      console.log(response)
    }
  });
}

const handleFechar = () => {

}

const handleVoltar = (() => {
  handleLimpar()
  emits('handleFechar');
});

onMounted(() => handleLimpar())

</script>

<style lang="scss">
.adicionar_conta_drawer {
  .el-drawer__header {
    font-size: 18px;
    font-weight: 600;
    color: #000;
    border-bottom: 1px solid rgb(223, 223, 223);
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
</style>