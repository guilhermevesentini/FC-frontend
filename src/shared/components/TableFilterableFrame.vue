<template>
    <el-input v-model="filtroAtual" clearable placeholder="Digite aqui..." :suffix-icon="Search"></el-input>
    <el-table :data="produtosFiltrados" style="width: 100%; margin-top: 10px;" empty-text="Sem Valores"
        v-loading="isLoading" :default-sort="{ prop: 'vencimento', order: 'ascending' }">
        <slot name="tableCollumn"></slot>
        <el-table-column align="right" width="200" fixed="right">
            <template #default="scope">
                <el-button small title="editar" :icon="Edit" link @click="handleEditar(scope.row)" />
                <el-button small type="danger" title="Deletar todos" :icon="Brush" link
                    @click="handleDeletar(scope.row, true)" />
                <el-button small type="danger" title="Deletar" :icon="Delete" link @click="handleDeletar(scope.row)" />
            </template>
        </el-table-column>
    </el-table>
    <el-col :span="12">
        <el-pagination v-model:current-page="currentPage" :page-size="itemsPerPage" layout="prev, pager, next"
            :total="produtos?.length" @current-change="handlePageChange" />
    </el-col>

    <ConfirmationDialog v-model="showConfirmation" @handle-confirmar="handleDeletar"
        @handle-cancelar="showConfirmation = false" />
</template>

<script lang="ts" setup>
import {
    Edit,
    Delete,
    Brush
} from '@element-plus/icons-vue'
import { filtrarItems } from '@/shared/utils/utils';
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue';
import ConfirmationDialog from './ConfirmationDialog.vue';

const props = defineProps<{
    produtos: unknown[] | undefined;
    Loading?: boolean
}>();

export interface ICadastroItem {
    id: number | string;
    nome?: string;
    despesaId?: string
}
const showConfirmation = ref(false);

const isLoading = computed(() => props.Loading)

const filtroAtual = ref<string>('');
const currentPage = ref(1);
const itemsPerPage = ref(6);

const produtosFiltrados = computed(() => {
    return filtrarItems(props?.produtos || [], filtroAtual, currentPage, itemsPerPage)
});

const handlePageChange = (newPage: number) => {
    currentPage.value = newPage;
};

const emits = defineEmits<{
    (event: "handleEditar", params: unknown): unknown;
    (event: "handleDeletar", item: any, multiplos?: boolean): string;
}>();


const handleEditar = (params: unknown) => {
    emits('handleEditar', params);
}
const handleDeletar = (row: any, multiplos?: boolean) => {
    emits('handleDeletar', row, multiplos);
}
</script>