<template>
  <el-row>
    <el-col class="container_page" :xs="24" :md="20">
      <el-row class="body">
        <el-col class="hidden-sm-and-up" :span="24"
          style="margin: 0.5rem 0 1rem; padding: 0; display: flex; align-items: center;    justify-content: center;">
          <DatePeriodoPicker />
        </el-col>
        <el-col :span="24" style="margin: 0.5rem 0 1rem;">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="4">
              <BreadCrumb name="Receitas" />
            </el-col>
            <el-col class="hidden-sm-and-down" span="auto"
              style="margin: 0; padding: 0; display: flex; align-items: center;">
              <DatePeriodoPicker />
            </el-col>
            <el-col :span="4" style="display: flex;flex-wrap: wrap; justify-content: flex-end;">
              <FCButtonIcon type="primary" circle :icon="Plus" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">

        </el-col>
      </el-row>
    </el-col>
    <el-col class="hidden-sm-and-down" :span="4">

    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import BreadCrumb from '@/shared/components/BreadCrumb.vue';
import FCButtonIcon from '@/shared/components/buttons/Criar/FCButtonIcon.vue';
import DatePeriodoPicker from '@/shared/components/DatePeriodoPicker.vue';
import {
  Plus
} from '@element-plus/icons-vue';

</script>

<style lang="scss" scoped>
.container_page {
  height: auto;
  min-height: 100vh;

  .body {
    min-height: auto;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    overflow: hidden;
  }
}
</style>