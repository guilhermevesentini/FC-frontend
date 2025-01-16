<template>
  <el-select class="FC-categorias-select" v-model="selectedValue" placeholder="Selecione..." filterable clearable
    :loading="loading">
    <el-option v-for="item in OPT" :key="item.value" :label="item.label" :value="item.value">
      <div style="display: flex; align-items: center;">
        <el-tag class="color-label" :color="item.cor"
          style="margin-right: 8px; border-radius: 5px; width: 10px; height: 15px; border: none;" />
        {{ item.label }}
      </div>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { ETipoCategory } from '@/core/@types/enums';
import { useCategoriasStore } from '@/core/store/categoriasStore/useCategoriasStore';
import { storeToRefs } from 'pinia';

type Props = {
  tipo: ETipoCategory
  modelValue: string | undefined
}

const loading = ref(false)

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const selectedValue = ref('')

const categoriasStore = useCategoriasStore()
const { categoriasOpt } = storeToRefs(categoriasStore)

const OPT = computed(() => categoriasOpt.value)

const value = ref<string[]>([])

categoriasOpt.value.forEach((color) => {
  value.value.push(color.value)
})

onMounted(async () => {
  await categoriasStore.fetchCategoriasLista(props.tipo)
})

watch(selectedValue, (newVal) => {
  if (newVal) {
    emit('update:modelValue', newVal)
  } else {
    emit('update:modelValue', undefined)
  }
})

watch(() => props.modelValue, (newVal) => {
  if (!newVal) selectedValue.value = ''
});
</script>

<style lang="scss">
.FC-categorias-select {
  .color-label {
    height: 50px;
    border-radius: 5px;
    margin-right: 8px;
  }
}
</style>