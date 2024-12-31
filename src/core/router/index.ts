import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/domains/login/views/logar/LoginPage.vue';
import { despesasPaths } from '../../domains/despesas/router/despesasPath';
import ResgistrarUsuario from '@/domains/login/views/registrar/ResgistrarUsuario.vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import { isAuthenticated } from '@/shared/composables/auth';
import { contasPaths } from '@/domains/contas/routes/contasPaths';
import { receitasPaths } from '@/domains/receitas/routes/receitasPaths';
import { overviewPaths } from '@/domains/overview/router/overviewPaths';
import NotFoundPage from '@/shared/components/NotFoundPage.vue';

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
  },
  { path: '/:pathMatch(.*)*', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHashHistory(),
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
