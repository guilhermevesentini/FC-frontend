<template>
    <el-input v-model="filtroAtual" clearable placeholder="Digite aqui..." :suffix-icon="Search"></el-input>
    <table class="table no-content" v-if="!produtosFiltrados">
        <Empty image-size="100px" />
    </table>
    <el-table v-else class="table" :data="produtosFiltrados" style="width: 100%; margin-top: 10px;"
        empty-text="Sem Valores" v-loading="isLoading" :default-sort="{ prop: 'vencimento', order: 'ascending' }">
        <slot name="tableCollumn"></slot>
        <el-table-column align="right" width="110" fixed="right">
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
import Empty from './Empty.vue';

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
    (event: "handleEditar", id: string): string;
    (event: "handleDeletar", item: any, multiplos?: boolean): string;
}>();


const handleEditar = (params: { id: string }) => {
    emits('handleEditar', params.id);
}
const handleDeletar = (row: any, multiplos?: boolean) => {
    emits('handleDeletar', row, multiplos);
}
</script>

<style lang="scss" scoped>
.table {
    background-color: var(--background-color-dark);
    color: var(--text-primary);

    &.no-content {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>