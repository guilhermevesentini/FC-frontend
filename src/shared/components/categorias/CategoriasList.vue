<template>
  <FCDrawer title="Categorias (Em construção)" :on-before-close="Limpar" destroy-on-close :hasFooter="false">
    <template #body>
      <ElButton type="primary" style="width: 100%; height: 40px;" @click="handleCriar()">
        Adicionar categoria
      </ElButton>
      <Empty v-if="!tableData"></Empty>
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" v-else>
        <el-table-column prop="nome" label="Nome" width="auto" />
        <el-table-column fixed="right" label="" width="60">
          <template #default="scope">
            <el-button link type="danger" size="small" @click.prevent="deletar(scope.row.id)">
              Exluir
            </el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-dialog v-model="dialogVisible" title="Nova categoria" width="350" :before-close="handleCloseDialog">
        <el-input v-model="novaCategoria" type="text" placeholder="Digite aqui" clearable></el-input>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="handleCloseDialog">cancelar</el-button>
            <el-button type="primary" @click="handleSalvar">
              Salvar
            </el-button>
          </div>
        </template>
      </el-dialog>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import FCDrawer from '../FCDrawer.vue';
import { container } from '@/inversify.config';
import { CategoriasGatewayDi, type CategoriaDto, type CategoriasGateway } from './services/ports/CategoriasGateway';
import { ETipoCategory } from '@/core/@types/enums';
import { ElButton } from 'element-plus';
import Empty from '../Empty.vue';
import useBreakpointsElement from '@/core/composables/useBreakpoints';

type Props = {
  tipo: ETipoCategory
}

const props = defineProps<Props>()

const dialogVisible = ref(false)

const novaCategoria = ref('')

const loading = ref(false)

const categoriasGateway = container.get<CategoriasGateway>(CategoriasGatewayDi);

const tableData = ref<CategoriaDto[]>([])

const { breakpoints } = useBreakpointsElement();

const isMobile = computed(() => {
  return breakpoints.smallerOrEqual("sm").value;
});

const widgetSize = computed(() => isMobile ? '100%' : '300px')

const Limpar = () => { }

const handleCriar = () => {
  novaCategoria.value = ''
  dialogVisible.value = true
}

const handleCloseDialog = () => {
  dialogVisible.value = false;
  novaCategoria.value = ''; // Limpa o valor do input
};

const obterCategorias = async () => {
  try {
    loading.value = true

    const response = await categoriasGateway.obter({ tipo: props.tipo })

    if (response?.statusCode != 200) return

    tableData.value = response.result || []
  } finally {
    loading.value = false
  }
}

const handleSalvar = async () => {
  const model = {
    id: undefined,
    nome: novaCategoria.value,
    tipo: props.tipo
  }

  const response = await categoriasGateway.criar(model)

  if (response?.statusCode != 200) return

  obterCategorias()

  dialogVisible.value = false
}

const deletar = async (id: string) => {
  const response = await categoriasGateway.deletar({ id: id, tipo: props.tipo })

  if (response?.statusCode != 200) return

  obterCategorias()
}

onMounted(() => {
  obterCategorias()
})
</script>

<style lang="scss" scoped></style>