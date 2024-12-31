export const contasPaths = [{
  path: "/contas",
  name: "Contas",
  component: () => import('@/domains/contas/views/ContasPage.vue'),
  meta: { requiresAuth: true }
}]