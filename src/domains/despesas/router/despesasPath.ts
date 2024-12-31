export const despesasPaths = [{
  path: "/despesas",
  name: "Despesas",
  component: () => import('@/domains/despesas/views/DespesasPage.vue'),
  meta: { requiresAuth: true }
}]