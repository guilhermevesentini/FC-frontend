<template>
  <div class="not-found">
    <h1>Página não encontrada</h1>
    <br><br>
    <img :src="notFound" width="40%">
  </div>
</template>

<script setup lang="ts">
import notFound from "@/shared/assets/images/not-found.svg"
</script>

<style lang="scss" scoped>
.not-found {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>