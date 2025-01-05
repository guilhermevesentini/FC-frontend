import ResgistrarUsuario from '@/domains/login/views/ResgistrarUsuario.vue';
import RecuperarSenha from '@/domains/login/views/RecuperarSenha.vue';
import Login from '@/domains/login/views/LoginPage.vue';

export const loginPaths = [
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
  }
]