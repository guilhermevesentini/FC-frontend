<template>
  <el-menu class="navbar" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <el-menu-item class="logo">
      <img :src="logo"> <span class="hidden-sm-and-down">Finance Control</span>
    </el-menu-item>
    <div class="flex-grow" />
    <span>{{ nomeUsuario }}</span>
    <div class="flex-grow" />
    <el-switch class="hidden-xs" v-model="thema" inline-prompt :active-icon="Sunny" :inactive-icon="Moon"
      @click="toggleTheme" />
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
import { useLogout } from "../composables/useLogout";

const thema = ref(true);

const nomeUsuario = ref('')

const { logout } = useLogout();

const handleSelect = (key: string, keyPath: string[]) => {
  router.push({ path: `/` });
}

const toggleTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  if (isDarkMode) {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }

  const newTheme = isDarkMode ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
};



onMounted(() => {
  const storage = localStorage.getItem('user');
  const usuario = storage ? JSON.parse(storage) : {};
  nomeUsuario.value = usuario.username || 'user';


  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  thema.value = savedTheme === 'dark';
});
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 60px;
  background-color: var(--background-color-navbar);
  padding: 1rem 0;
  display: flex;
  align-items: center;
  color: var(--background-color-text-primary);
  position: fixed;
  z-index: 5;

  .el-menu-item:first-child:hover {
    background-color: transparent;
  }

  .logo {
    color: var(--background-color-text-primary);
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
    color: var(--background-color-text-primary);

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
</style>
