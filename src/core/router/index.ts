import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/domains/login/views/logar/LoginPage.vue';
import { despesasPaths } from '../../domains/despesas/router/despesasPath';
import ResgistrarUsuario from '@/domains/login/views/registrar/ResgistrarUsuario.vue';
import RecuperarSenha from '@/domains/login/views/recuperarSenha/RecuperarSenha.vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import { isAuthenticated } from '@/shared/composables/auth';
import { contasPaths } from '@/domains/contas/routes/contasPaths';
import { receitasPaths } from '@/domains/receitas/routes/receitasPaths';
import { overviewPaths } from '@/domains/overview/router/overviewPaths';
import NotFoundPage from '@/shared/components/NotFoundPage.vue';
import { useLogout } from '../composables/useLogout';

const { logout } = useLogout();

const routes: Array<RouteRecordRaw> = [    
  { path: '/login', component: Login },
  {
    path: '/novoUsuario',
    name: "Novo usuario",
    component: ResgistrarUsuario
  },
  {
    path: '/recuperarSenha',
    name: "Recuperar senha",
    component: RecuperarSenha
  },
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
    logout()

    next('/login');
  } else {
    next();
  }
});

export default router
