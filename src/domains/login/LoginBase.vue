<template>
  <div class="login_page-frame">
    <img class="background-img" :src="background" alt="finance background">
    <slot name="body"></slot>
  </div>
</template>

<script setup lang="ts">
import background from '@/shared/assets/images/finance-background.jpg';
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

  .background-img {
    position: absolute;
    z-index: 0;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    opacity: 0.09;
    filter: invert(0) sepia(1);
  }
}
</style>