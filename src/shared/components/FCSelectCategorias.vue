<template>
  <el-select v-model="selectedValue" placeholder="Selecione..." filterable clearable>
    <el-option v-for="item in ECategoriasOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { container } from '@/inversify.config';
import { CategoriasGatewayDi, type CategoriaDto, type CategoriasGateway } from './categorias/services/ports/CategoriasGateway';
import { onMounted, ref, watch } from 'vue';
import type { ETipoCategory } from '@/core/@types/enums';

type Props = {
  tipo: ETipoCategory
  modelValue: string | undefined
}

const loading = ref(false)

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const selectedValue = ref('')

const categorias = ref<CategoriaDto[]>([])

const categoriasGateway = container.get<CategoriasGateway>(CategoriasGatewayDi);

const ECategoriasOpt = ref()

const obterCategorias = async () => {
  try {
    loading.value = true

    const response = await categoriasGateway.obter({ tipo: props.tipo })

    if (response?.statusCode != 200) return

    categorias.value = response.result || []

    ECategoriasOpt.value = response.result?.map((categoria: CategoriaDto) => {
      return {
        label: categoria.nome,
        value: categoria.id
      }
    })
  } finally {
    loading.value = false
  }
}


onMounted(async () => {
  await obterCategorias()
})

watch(selectedValue, (newVal) => {
  if (newVal) {
    emit('update:modelValue', { categoria: newVal })
  } else {
    emit('update:modelValue', { categoria: undefined })
  }
})

watch(() => props.modelValue, (newVal) => {
  if (!newVal) selectedValue.value = ''
});
</script>

<style lang="scss" scoped></style>