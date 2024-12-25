<template>
  <el-select v-model="selectedValue" placeholder="Selecione..." filterable clearable>
    <el-option v-for="item in EListaBancosOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { ContasGatewayDi, type ContasGateway } from '@/domains/contas/services/ports/ContasGateway';
import { container } from '@/inversify.config';
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue';

const contasGateway = container.get<ContasGateway>(ContasGatewayDi);

type Props = {
  modelValue: number | undefined
}
const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

type EBancoResponse = {
  code: number
  fullName: string
  ispb: string
  name: string
}

const selectedValue = ref(props.modelValue)

const EListaBancosOpt = ref()

const obterBancos = async () => {
  try {
    const response = await contasGateway.obterBancos();

    EListaBancosOpt.value = response?.body?.result?.map((banco: EBancoResponse, i: number) => {
      return {
        label: banco.name,
        value: banco.code ? banco.code.toString() : i.toString(),
        name: banco.name
      }
    })
  } catch (error) {
    console.error('Erro ao buscar os bancos:', error);
  }
}

onMounted(async () => {
  await obterBancos()
})

watch(selectedValue, (newVal) => {
  if (newVal) {
    const findName = EListaBancosOpt.value.filter((banco: { label: string, value: string, name: string }) => banco.value == newVal.toString())

    emit('update:modelValue', { banco: newVal, name: findName[0].name || '' })
  } else {
    emit('update:modelValue', { banco: undefined, name: '' })
  }
})
</script>

<style lang="scss" scoped></style>
