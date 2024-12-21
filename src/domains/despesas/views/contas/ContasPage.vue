<template>
  <el-row>
    <el-col class="container_page" :span="24">
      <el-row class="body">
        <el-col class="hidden-sm-and-up" :span="24"
          style="margin: 0.5rem 0 1rem; padding: 0; display: flex; align-items: center;    justify-content: center;">
          <DatePeriodoPicker />
        </el-col>
        <el-col :span="24" style="margin: 0.5rem 0 1rem;">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="4">
              <BreadCrumb name="Contas" />
            </el-col>
            <el-col :span="4" style="display: flex;flex-wrap: wrap; justify-content: flex-end;">
              <FCButtonIcon type="primary" circle :icon="Plus" @click="handleAdicionar" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <div class="despesas-cartao">
            <el-card class="despesas-cartao-card" style="max-width: 480px" v-for="card in exampleCards" :key="card.id">
              <template #header>
                <div class="despesas-cartao-card_header">
                  <div class="title">
                    {{ card.nome }}
                  </div>
                  <div>
                    <el-button small type="danger" title="Deletar" :icon="Delete" link />
                  </div>
                </div>
              </template>
              <div>
                <div class="title">
                  {{ card.usuario }}
                </div>
                <div class="item">
                  Agência: {{ card.agencia }} / conta: {{ card.conta }}
                </div>
                <div class="item">
                  Saldo: {{ card.saldo }}
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <AdicionarContaWidget v-model="showAdicionar" v-on:handle-fechar="showAdicionar = false" />
</template>

<script setup lang="ts">
import BreadCrumb from '@/shared/components/BreadCrumb.vue';
import FCButtonIcon from '@/shared/components/buttons/Criar/FCButtonIcon.vue';
import DatePeriodoPicker from '@/shared/components/DatePeriodoPicker.vue';
import {
  Edit,
  Plus,
  Delete,
} from '@element-plus/icons-vue'
import AdicionarContaWidget from './widgets/adicionar/AdicionarContaWidget.vue';
import { onUnmounted, ref } from 'vue';
import { container } from '@/inversify.config';
import { contasContainer } from './container/contasContainer';

container.load(contasContainer)

const showAdicionar = ref(false)

const exampleCards = [
  {
    id: '16529542',
    nome: 'Nubank',
    conta: '1652364',
    agencia: '006',
    usuario: 'Guilherme Vesentini',
    saldo: 'R$ 5.000,00'
  }
]

const handleAdicionar = () => {
  showAdicionar.value = true
}

onUnmounted(() => container.unload(contasContainer))
</script>

<style lang="scss" scoped>
.container_page {
  background-color: #fff;
  padding: 10px;
  height: auto;
  overflow: hidden;
  border-radius: 5px;
  min-height: calc(100vh - 60px);

  .body {
    min-height: auto;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    overflow: hidden;

    .despesas-cartao {
      display: grid;

      &-card {
        cursor: pointer;
        background-color: #fff;

        &_header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title {
            font-size: 1.5rem;
            font-weight: 400;
          }
        }

        .title {
          font-size: 1.5rem;
          font-weight: 400;
        }

        .item {
          margin: 0.6rem 0;
        }
      }

      &-card:hover {
        cursor: pointer;
        background-color: rgb(249, 249, 249);
        box-shadow: 2px 2px 6px 2px #a5d4f8;
      }
    }
  }
}
</style>