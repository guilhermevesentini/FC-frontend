<template>
    <div class="breadcrumb"><span style="position: relative; bottom: 3px; font-size: 20px;">{{ icon }}</span> {{ name }}
    </div>
</template>

<script setup lang="ts">
defineProps<{ name: string, icon: unknown }>();
</script>

<style lang="scss" scoped>
.breadcrumb {
    display: flex;
    align-items: center;
    display: contents;
    font-size: 25px;
}
</style>