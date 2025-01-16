<template>
  <el-menu class="navbar" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <el-menu-item class="logo">
      <img :src="logo"> <span class="hidden-sm-and-down">Finance Control</span>
    </el-menu-item>
    <div class="flex-grow" />
    <span>{{ nomeUsuario }}</span>
    <div class="flex-grow" />
    <el-switch class="hidden-xs" v-model="thema" inline-prompt :active-icon="Moon" :inactive-icon="Sunny"
      @click="toggleTheme" />
    <el-dropdown trigger="click" class="menu">
      <span class="el-dropdown-link">
        <el-icon class="el-icon--right">
          <Avatar />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu style="width: 200px;">
          <el-dropdown-item @click="showAlterarSenha = true" :icon="Lock">Alterar Senha</el-dropdown-item>
          <el-divider style="margin: 5px 0 5px"></el-divider>
          <el-dropdown-item :icon="SwitchButton" @click="logout">Sair</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-menu>
  <AlterarSenha v-model="showAlterarSenha" v-on:handle-fechar="showAlterarSenha = false" />
</template>

<script setup lang="ts">
import logo from "@/shared/assets/images/logo.png";
import router from "@/core/router";
import { Lock, Avatar, SwitchButton, Sunny, Moon } from "@element-plus/icons-vue";
import { onMounted, ref, watch } from "vue";
import { useLogout } from "../composables/useLogout";
import AlterarSenha from "@/shared/components/menu-de-configuracao/alterar-senha/AlterarSenha.vue";
import { useDarkModeStore } from "../store/darkMode/useDarkModeStore";

const savedTheme = localStorage.getItem('theme') || 'light';
const isDarkMode = savedTheme === 'dark';
const thema = ref(isDarkMode);

const darkModeStore = useDarkModeStore();

const nomeUsuario = ref("");
const showAlterarSenha = ref(false);

const { logout } = useLogout();

const handleSelect = (key: string, keyPath: string[]) => {
  router.push({ path: `/` });
};

const toggleTheme = () => {
  const isDarkMode = darkModeStore.thema === "dark";
  const newTheme = isDarkMode ? "light" : "dark";

  document.documentElement.classList.remove(isDarkMode ? "dark" : "light");
  document.documentElement.classList.add(newTheme);

  darkModeStore.setTheme(newTheme); // Atualiza o tema na store
  localStorage.setItem("theme", newTheme);
};

onMounted(() => {
  const storage = localStorage.getItem("user");
  const usuario = storage ? JSON.parse(storage) : {};
  nomeUsuario.value = usuario.username || "user";

  const savedTheme = localStorage.getItem("theme") || "light";
  darkModeStore.setTheme(savedTheme); // Inicializa o tema na store
  document.documentElement.classList.add(savedTheme);
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
