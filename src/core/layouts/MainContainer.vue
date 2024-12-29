<template>
  <div class="main">
    <div>
      <FCNavbar :navbar-items="navItemsDespesas" />
    </div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { navItemsDespesas } from '@/domains/despesas/types';
import FCNavbar from '@/shared/components/navbar/FCNavbar.vue';
</script>

<style scoped>
.main {
  height: 100%;
  width: auto;
  background-color: var(--background-color);
  padding: 7px;
  position: relative;
  /* margin-left: 60px; */
}
</style>