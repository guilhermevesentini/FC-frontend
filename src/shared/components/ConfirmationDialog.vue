<template>
  <el-dialog v-bind="$attrs">
    <p>Você esta prestes a excluir todos os registros do item selecionado, tem certeza disso?</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancelar">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmar">
          Confirmar
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (event: "handleCancelar"): unknown;
  (event: "handleConfirmar", value: boolean): boolean;
}>();

const handleCancelar = () => {
  emits("handleCancelar")
}

const handleConfirmar = () => {
  emits("handleConfirmar", true)
}
</script>

<style scoped></style>