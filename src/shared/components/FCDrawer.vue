<template>
  <el-drawer v-bind="$attrs" :size="widgetSize" class="FC-Drawer" destroy-on-close>
    <template #header="{ close, titleId, titleClass }">
      <h4>{{ title }}</h4>
    </template>
    <slot name="body"></slot>
    <template #footer>
      <slot name="FLeft"></slot>
      <slot name="FRight"></slot>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useBreakpointsElement from '@/shared/composables/useBreakpoints';
import { computed } from 'vue';


interface IProps {
  title: string
  size?: string
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  size: '700px'
})

const { breakpoints } = useBreakpointsElement();

const isMobile = computed(() => {
  return breakpoints.smallerOrEqual("sm").value;
});

const widgetSize = computed(() => isMobile ? '100%' : props.size)
</script>

<style lang="scss">
.FC-Drawer {
  color: var(--text-primary);

  .el-drawer__header {
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid rgb(223, 223, 223);
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .el-drawer__body {
    overflow-y: auto;
  }

  .el-drawer__footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgb(223, 223, 223);
    padding: 1rem;
    margin-top: 1rem;
  }
}
</style>