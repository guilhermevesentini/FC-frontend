export const contasPaths = [{
  path: "/contas",
  name: "Contas",
  component: () => import('@/domains/contas/ContasPage.vue'),
  meta: { requiresAuth: true }
}]