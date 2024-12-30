import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/domains/login/views/logar/LoginPage.vue';
import { despesasPaths } from '../../domains/despesas/router/despesasPath';
import ResgistrarUsuario from '@/domains/login/views/registrar/ResgistrarUsuario.vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import { isAuthenticated } from '@/shared/composables/auth';
import { contasPaths } from '@/domains/contas/routes/contasPaths';
import { receitasPaths } from '@/domains/receitas/routes/receitasPaths';
import { overviewPaths } from '@/domains/overview/router/overviewPaths';

const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: Login },
  { path: '/novoUsuario', component: ResgistrarUsuario },
  { 
    path: '/', 
    redirect: '/login',
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      ...overviewPaths,
      ...receitasPaths,
      ...despesasPaths,
      ...contasPaths,
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router
