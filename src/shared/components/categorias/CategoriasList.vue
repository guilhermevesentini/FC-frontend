<template>
  <FCDrawer title="Categorias (Em construção)" :on-before-close="Limpar" destroy-on-close>
    <template #body>
      <ElButton @click="handleCriar()">Criar categoria</ElButton>
      <br>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="nome" label="Nome" width="auto" />
      </el-table>

      <el-dialog v-model="dialogVisible" title="Nova categoria" width="500">
        <el-input v-model="novaCategoria" type="text" placeholder="Digite aqui"></el-input>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">cancelar</el-button>
            <el-button type="primary" @click="handleSalvar">
              Salvar
            </el-button>
          </div>
        </template>
      </el-dialog>
    </template>
    <template #FLeft>
      <span></span>
    </template>
    <template #FRight>
      <el-button type="primary" @click="handleCriar()" :loading="loading">Salvar</el-button>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import FCDrawer from '../FCDrawer.vue';
import { container } from '@/inversify.config';
import { categoriasContainer } from './container/categoriasContainer';
import { CategoriasGatewayDi, type CategoriaDto, type CategoriasGateway } from './services/ports/CategoriasGateway';
import { ETipoCategory } from '@/core/@types/enums';
import { ElButton } from 'element-plus';

container.load(categoriasContainer)

const dialogVisible = ref(false)

const novaCategoria = ref('')

const loading = ref(false)

const categoriasGateway = container.get<CategoriasGateway>(CategoriasGatewayDi);

const tableData = ref<CategoriaDto[]>([])

const Limpar = () => { }

const handleCriar = () => {
  dialogVisible.value = true
}

const obterCategorias = async () => {
  const response = await categoriasGateway.obter({ tipo: ETipoCategory.income })

  if (response?.statusCode != 200) return

  tableData.value = response.result || []
}

const handleSalvar = async () => {
  const model = {
    id: undefined,
    nome: novaCategoria.value,
    tipo: ETipoCategory.expense
  }

  const response = await categoriasGateway.criar(model)

  if (response?.statusCode != 200) return

  obterCategorias()
}

onMounted(() => {
  obterCategorias()
})

onUnmounted(() => container.unload(categoriasContainer))
</script>

<style lang="scss" scoped></style>