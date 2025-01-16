<template>
  <el-tabs v-model="currentRoute" class="FC-Navbar" @tab-click="handleTabClick">
    <el-tab-pane v-for="menu in navbarItems" :key="menu.name" :name="menu.name">
      <template #label>
        {{ menu.label }}
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type PageItems } from './useFCNavbar';
import type { TabsPaneContext } from 'element-plus';
import useGlobalLoading from '@/core/composables/useGlobalLoading';

type IProps = {
  navbarItems: PageItems[]
}

defineProps<IProps>()

const router = useRouter();
const route = useRoute();

const routername = computed<string>(() => router.currentRoute.value.name as string);
const currentRoute = ref<string>(routername.value || '/Overview');

const { start, finish } = useGlobalLoading();

const handleTabClick = (tab: TabsPaneContext) => {
  currentRoute.value = String(tab.props.name);
};

watch(() => route.name, () => {
  currentRoute.value = route.path as string;
}, { deep: true, immediate: true });

watch(currentRoute, (routeName: string) => {
  try {
    start();
    router.push(routeName);
  } catch (err) { console.log(err) } finally {
    finish();
  }
}, { deep: true, immediate: true });
</script>

<style lang="scss">
.FC-Navbar {
  background-color: var(--background-color-dark);
  color: var(--text-primary);
  padding: 10px;
  overflow: hidden;
  border-radius: 5px;
  margin-bottom: 1rem;

  .el-tabs__header {
    margin: 0 !important;
  }
}
</style>