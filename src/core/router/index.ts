import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/domains/login/views/logar/LoginPage.vue';
import { dashboardPaths } from '../../domains/dashboard/router/dashboard/dashboardPath';
import { despesasPaths } from '../../domains/despesas/router/despesas/despesasPath';
import ResgistrarUsuario from '@/domains/login/views/registrar/ResgistrarUsuario.vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import { isAuthenticated } from '@/shared/composables/auth';

const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: Login },
  { path: '/novoUsuario', component: ResgistrarUsuario },
  { 
    path: '/', 
    redirect: '/login',
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      ...dashboardPaths,
      ...despesasPaths
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
