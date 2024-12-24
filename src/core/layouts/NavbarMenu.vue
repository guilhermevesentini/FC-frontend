<template>
  <el-menu class="navbar" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <el-menu-item class="logo">
      <img :src="logo"> <span class="hidden-sm-and-down">Finance Control</span>
    </el-menu-item>
    <div class="flex-grow" />
    <span>{{ nomeUsuario }}</span>
    <div class="flex-grow" />
    <!-- Simplificando a alternância de tema usando apenas v-model -->
    <el-switch class="hidden-sm-and-down" v-model="thema" inline-prompt :active-icon="Sunny" :inactive-icon="Moon" />
    <el-dropdown trigger="click" class="menu">
      <span class="el-dropdown-link">
        <el-icon class="el-icon--right">
          <Avatar />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Configurar Conta</el-dropdown-item>
          <el-dropdown-item>Personalizar</el-dropdown-item>
          <el-dropdown-item :icon="SwitchButton" @click="logout">Sair</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-menu>
</template>

<script setup lang="ts">
import logo from "@/shared/assets/images/logo.png";
import router from '@/core/router';
import { Avatar, SwitchButton, Sunny, Moon } from '@element-plus/icons-vue'
import { onMounted, ref } from "vue";

const thema = ref(true); // Controle do tema com v-model

const nomeUsuario = ref('')

const handleSelect = (key: string, keyPath: string[]) => {
  router.push({ path: `/` });
}

const logout = (() => {
  localStorage.removeItem('user');
  router.push({ path: `/login` });
})

// Toggle entre os temas, dependendo do valor de `v-model` (thema)
const toggleTheme = () => {
  const newTheme = thema.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); // Salva o tema no localStorage
};

// Ao montar, recupera o tema do localStorage e aplica
onMounted(() => {
  const storage = localStorage.getItem('user');
  const usuario = storage ? JSON.parse(storage) : {};
  nomeUsuario.value = usuario.username || 'user';

  // Recupera o tema salvo e aplica ao document.documentElement
  const savedTheme = localStorage.getItem('theme') || 'light'; // Default para 'light' se não encontrado
  document.documentElement.setAttribute('data-theme', savedTheme);
  thema.value = savedTheme === 'dark'; // Atualiza o valor de `thema` com base no tema salvo
});
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 60px;
  background-color: #466ff5;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  color: #fff;
  position: fixed;
  z-index: 5;

  .el-menu-item:first-child:hover {
    background-color: transparent;
  }

  .logo {
    color: #fff;
  }

  .logo:hover {
    background-color: none !important;
  }

  img {
    width: 25px;
    margin-right: 0.5rem;
  }

  .menu {
    padding: 1rem;
    color: #fff;

    .el-icon--right {
      font-size: 24px;
      cursor: pointer;
    }
  }

  .flex-grow {
    flex-grow: 1;
  }

  .block-col-2 .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
  }

  .block-col-2 .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}

/* Estilos globais para os temas */
:root {
  --background-color: #ffffff;
  --text-color: #000000;
}

[data-theme='dark'] {
  --background-color: #1e1e1e;
  --text-color: #ffffff;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
