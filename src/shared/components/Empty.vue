<template>
  <div class="no-data">
    <el-empty :description="text" :image-size="imageSize" v-if="!onlyIcon" />
    <el-empty description=" " :image-size="imageSize" fill="blue" v-else />
  </div>
</template>

<script setup lang="ts">
type Props = {
  text?: string
  onlyIcon?: boolean
  imageSize?: string
}

withDefaults(defineProps<Props>(), {
  text: "Não contém informações",
  onlyIcon: false,
  imageSize: '100%'
});
</script>

<style lang="scss" scoped>
.no-data {
  width: 100%;
  height: min-content;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  padding: 0;
  margin: 0;
}
</style>