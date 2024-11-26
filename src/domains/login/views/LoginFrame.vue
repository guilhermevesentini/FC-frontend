<template>
  <div class="login_page-frame">
    <slot name="body"></slot>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.login_page-frame {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  padding: 0;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
</style>