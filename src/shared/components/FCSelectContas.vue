<template>
  <el-select v-model="selectedValue" placeholder="Selecione..." filterable clearable>
    <el-option v-for="item in EListaContasOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { ContasGatewayDi, type ContaOutputDto, type ContasGateway } from '@/domains/despesas/views/contas/services/ports/ContasGateway';
import { container } from '@/inversify.config';
import { onMounted, ref, watch } from 'vue';

const contasGateway = container.get<ContasGateway>(ContasGatewayDi);

type Props = {
  modelValue: string | undefined
}
const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const selectedValue = ref(props.modelValue)

const EListaContasOpt = ref()

const obterBancos = async () => {
  try {
    const response = await contasGateway.obter();

    EListaContasOpt.value = response?.result?.map((conta: ContaOutputDto, i: number) => {
      return {
        label: conta.nomeBanco,
        value: conta.id
      }
    })
  } catch (error) {
    console.error('Erro ao buscar as contas:', error);
  }
}

onMounted(async () => {
  await obterBancos()
})

watch(selectedValue, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style lang="scss" scoped></style>
