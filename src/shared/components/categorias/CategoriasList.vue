<template>
  <FCDrawer title="Categorias (Em construção)" :on-before-close="Limpar" destroy-on-close :hasFooter="false">
    <template #body>
      <ElButton type="primary" style="width: 100%; height: 40px; margin-bottom: 1rem;" @click="handleCriar()">
        Adicionar categoria
      </ElButton>
      <Empty v-if="!tableData"></Empty>
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" v-else>
        <el-table-column prop="color" label="Cor" width="100">
          <template #default="scope">
            <span style="padding: 10 25px; width: 60px; height: 25px; display: block; border-radius: 5px;"
              :style="{ backgroundColor: scope.row.color }"></span>
          </template>
        </el-table-column>
        <el-table-column prop="nome" label="Nome" width="auto" />
        <el-table-column fixed="right" label="" width="80">
          <template #default="scope">
            <div style="display: flex;">
              <el-button link type="info" :icon="EditPen" size="small" @click.prevent="handleEditar(scope.row)" />
              <el-button link type="danger" :icon="Delete" size="small" @click.prevent="deletar(scope.row.id)" />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="dialogVisible" title="Nova categoria" :width="widgetSize" :before-close="handleCloseDialog">
        <el-form ref="formRef" :model="form" label-width="auto" style="width: 100%; margin: 1rem 0;" :rules="rules">
          <el-row>
            <el-col :span="21">
              <el-form-item prop="nome" label="">
                <el-input v-model="form.nome" type="text" placeholder="Digite aqui" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="color" label="">
                <el-color-picker v-model="form.color" :predefine="EcolorsPalette" style="margin-left: 10px;"
                  @change="onColorChange" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="handleCloseDialog">cancelar</el-button>
            <el-button type="primary" @click="submitForm(formRef)">
              Salvar
            </el-button>
          </div>
        </template>
      </el-dialog>
    </template>
  </FCDrawer>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import FCDrawer from '../FCDrawer.vue';
import { container } from '@/inversify.config';
import { CategoriasGatewayDi, type CategoriaDto, type CategoriasGateway } from '../../../core/services/ports/CategoriasGateway';
import { EcolorsPalette, ETipoCategory } from '@/core/@types/enums';
import { ElButton, type FormInstance, type FormRules } from 'element-plus';
import Empty from '../Empty.vue';
import useBreakpointsElement from '@/core/composables/useBreakpoints';
import {
  EditPen,
  Delete,
} from '@element-plus/icons-vue'
import { useCategoriasStore } from '@/core/store/categoriasStore/useCategoriasStore';

type Props = {
  tipo: ETipoCategory
}

const props = defineProps<Props>()

const dialogVisible = ref(false)

const loading = ref(false)

const categoriasGateway = container.get<CategoriasGateway>(CategoriasGatewayDi);

const tableData = ref<CategoriaDto[]>([])

interface RuleForm {
  id: string
  nome: string
  color: string
}

const formRef = ref<FormInstance>()

const categoriasStore = useCategoriasStore()

const form = reactive<RuleForm>({
  id: '',
  nome: '',
  color: '#ccc'
})

const onColorChange = (value: string) => {
  if (!value) {
    form.color = '#ccc';
  }
};

const rules = reactive<FormRules<RuleForm>>({
  nome: [
    { required: true, message: 'Por favor, preencha o nome', trigger: 'blur' },
    { min: 3, max: 15, message: 'Mínimo de 3 a 15 caracteres', trigger: 'blur' },
  ],
  color: [
    { required: true, message: '', trigger: 'blur' }
  ],
})

const { breakpoints } = useBreakpointsElement();

const isMobile = computed(() => {
  return breakpoints.smallerOrEqual("xs").value;
});

const widgetSize = computed(() => isMobile.value ? '100%' : '400px')

const Limpar = () => {
  form.id = '';
  form.nome = '';
  form.color = '#ccc';
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (form.id) handleSalvar('editar')
      else handleSalvar('criar')
    }
  })
}

const handleCloseDialog = async () => {
  dialogVisible.value = false;
  Limpar()
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

const handleSalvar = async (action: 'editar' | 'criar') => {
  const model = {
    id: action == 'criar' ? '' : form.id,
    nome: form.nome,
    color: form.color || '#ccc',
    tipo: props.tipo
  }

  const response = await categoriasGateway[action](model)

  if (response?.statusCode != 200) return

  obterCategorias()

  dialogVisible.value = false

  await categoriasStore.fetchCategoriasLista(props.tipo)
}

const deletar = async (id: string) => {
  const response = await categoriasGateway.deletar({ id: id, tipo: props.tipo })

  if (response?.statusCode != 200) return

  obterCategorias()
}

const handleEditar = async (row: CategoriaDto) => {
  if (!row.id) return

  form.nome = row.nome
  form.color = row.color
  form.id = row.id as string
  dialogVisible.value = true
}

const handleCriar = async () => {
  Limpar()
  dialogVisible.value = true
}

onMounted(() => {
  obterCategorias()
})
</script>

<style lang="scss" scoped></style>