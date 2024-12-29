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
          <div v-if="!contas?.length" style="height: 100%;">
            <Empty image-size="200px" />
          </div>
          <div class="despesas-cartao" v-else>
            <el-card class="despesas-cartao-card" style="max-width: 480px" v-for="card in contas" :key="card.id"
              :style="{ border: card.contaPrincipal ? '1px solid #a6d4fc' : '' }">
              <template #header>
                <div class="despesas-cartao-card_header">
                  <div class="title">
                    {{ card.nomeBanco }}
                  </div>
                  <div>
                    <el-button small type="danger" title="Deletar" :icon="Delete" link @click="handleDelete(card)" />
                  </div>
                </div>
              </template>
              <div>
                <div class="title">
                  {{ card.nome }}
                </div>
                <div class="item">
                  Agência: {{ card.agencia }} / conta: {{ card.conta }}
                </div>
                <div class="item">
                  Saldo: {{ card.saldo || 'R$ 0,00' }}
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <AdicionarContaWidget v-model="showAdicionar" v-on:handle-fechar="handleFechar" />
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
import { onMounted, ref } from 'vue';
import { container } from '@/inversify.config';
import { ElNotification } from 'element-plus';
import { ContasGatewayDi, type ContaOutputDto, type ContasGateway } from '../services/ports/ContasGateway';
import AdicionarContaWidget from '../widgets/AdicionarContaWidget.vue';
import Empty from '@/shared/components/Empty.vue';

const showAdicionar = ref(false)

const contas = ref<ContaOutputDto[]>()

const contasGateway = container.get<ContasGateway>(ContasGatewayDi);

const handleAdicionar = () => {
  showAdicionar.value = true
}

const handleFechar = async () => {
  showAdicionar.value = false
  await obterContas();
}

const obterContas = async () => {
  const response = await contasGateway.obter();
  if (response?.statusCode == 200) {
    contas.value = (response.result || []).sort((a, b) => {
      return Number(b.contaPrincipal) - Number(a.contaPrincipal);
    });
  }
}

const handleDelete = async (conta: ContaOutputDto) => {
  console.log({ id: conta.id });

  const response = await contasGateway.delete({ id: conta.id });
  if (response) {
    ElNotification({
      title: 'success',
      message: 'Conta Excluída com sucesso.',
      type: 'success',
      duration: 2000
    })

    await obterContas();
  } else {
    ElNotification({
      title: 'error',
      message: 'Houve um erro ao excluir a conta, tente novamente mais tarde.',
      type: 'error',
      duration: 2000
    })
  }
}

onMounted(async () => {
  await obterContas();
})
</script>

<style lang="scss" scoped>
.container_page {
  background-color: var(--background-color-dark);
  padding: 0;
  height: auto;
  overflow: hidden;
  border-radius: 5px;
  min-height: calc(100vh - 60px);

  .body {
    min-height: auto;
    background-color: var(--background-color-dark);
    color: var(--text-primary);
    padding: 10px;
    border-radius: 5px;
    overflow: hidden;

    .despesas-cartao {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: auto;
      gap: 16px;
      width: 100%;
      padding: 1rem;

      &-card {
        width: 100%;
        cursor: pointer;
        background-color: var(--background-color-darker);

        &_header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title {
            font-size: 1.5rem;
            font-weight: 400;
            max-width: 80%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
        box-shadow: 2px 2px 6px 2px #a5d4f8;
      }
    }
  }
}
</style>