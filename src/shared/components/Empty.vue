<template>
  <div class="no-data">
    <el-empty :description="text" :image-size="imageSize" v-if="!onlyIcon" />
    <el-empty description=" " :image-size="imageSize" v-else />
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
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
}
</style>