<template>
  <el-drawer class="adicionar_conta_drawer" size="600px" height="100%" :before-close="onCloseDrawer">
    <template #header>
      <h4>Adicionar conta</h4>
    </template>
    <el-form ref="formRef" :model="contaDetails" :rules="rules" label-position="top" style="width: 100%"
      v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Banco" prop="banco">
            <FCSelectBancos v-model="contaDetails.banco" @update:model-value="updateBanco" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Nome" prop="nome">
            <el-input v-model="contaDetails.nome" placeholder="Digite aqui" />
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
            <el-input v-model="contaDetails.saldo" :formatter="(value: string) => format(value, configInputMask)"
              :parser="(value: string) => unformat(value, configInputMask)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="contaPrincipal">
            <el-checkbox v-model="contaDetails.contaPrincipal" label="Definir como conta principal?" size="small" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleVoltar">Cancel</el-button>
      <el-button type="primary" @click="handleCriar(formRef)" :loading="loading">Salvar</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { unformat, format } from 'v-money3';
import type { FormInstance, FormRules } from 'element-plus';
import { container } from '@/inversify.config';
import FCSelectBancos from '@/shared/components/FCSelectBancos.vue';
import { ContasGatewayDi, type ContaOutputDto, type ContasGateway } from '../services/ports/ContasGateway';
import { configInputMask } from '@/core/@types/types';

const loading = ref(false)

const contasGateway = container.get<ContasGateway>(ContasGatewayDi);

const contaDetails = ref<ContaOutputDto>({
  agencia: '',
  contaPrincipal: false,
  conta: undefined,
  id: '',
  nome: '',
  banco: undefined,
  nomeBanco: '',
  saldo: ''
})

const formRef = ref<FormInstance>();

const rules = reactive<FormRules<ContaOutputDto>>({
  banco: [{ required: true, message: '', trigger: 'blur' }],
  nome: [{ required: true, message: '', trigger: 'blur' }],
  agencia: [{ required: true, message: '', trigger: 'blur', min: 3 }],
  conta: [{ required: true, message: '', trigger: 'blur' }]
});

const emits = defineEmits<{
  (event: "handleFechar"): void;
}>();

const onCloseDrawer = (done: () => void) => {
  handleLimpar()
  done();
}
const handleLimpar = () => {
  contaDetails.value.agencia = ''
  contaDetails.value.conta = ''
  contaDetails.value.nome = ''
  contaDetails.value.nomeBanco = ''
  contaDetails.value.banco = undefined
  contaDetails.value.contaPrincipal = false
  contaDetails.value.saldo = ''
  contaDetails.value.id = ''
}

const updateBanco = (params: { banco: number, name: string }) => {
  contaDetails.value.banco = Number(params.banco)
  contaDetails.value.nomeBanco = params.name
}

const handleCriar = async (formEl: FormInstance | undefined) => {
  if (!formEl?.validate()) return

  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true

        const response = await contasGateway.criar(contaDetails.value);

        if (response) {
          emits('handleFechar');
        }
      } catch (err) {
        console.log(err)
      } finally {
        loading.value = false
      }
    }
  });
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
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid rgb(223, 223, 223);
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
</style>