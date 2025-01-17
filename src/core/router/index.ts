import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { despesasPaths } from '../../domains/despesas/router/despesasPath';
import BaseLayout from '../layouts/BaseLayout.vue';
import { isAuthenticated } from '@/core/composables/auth';
import { contasPaths } from '@/domains/contas/routes/contasPaths';
import { receitasPaths } from '@/domains/receitas/routes/receitasPaths';
import { overviewPaths } from '@/domains/overview/router/overviewPaths';
import NotFoundPage from '@/shared/components/NotFoundPage.vue';
import { useLogout } from '../composables/useLogout';
import { loginPaths } from '@/domains/login/router/loginPaths';

const { logout } = useLogout();

const routes: Array<RouteRecordRaw> = [    
  ...loginPaths,
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

router.beforeEach(async (to, from, next) => { 
  try {
    if (to.meta.requiresAuth && !isAuthenticated()) {
      await logout();
      next('/login');
    } else {
      next();
    }
  } catch (error) {
    console.error('Error during navigation:', error);
    next(false);
  }
});

export default router
