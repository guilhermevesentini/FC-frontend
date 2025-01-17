export const despesasPaths = [{
  path: "/despesas",
  name: "Despesas",
  component: () => import('@/domains/despesas/DespesasBase.vue'),
  meta: { requiresAuth: true }
}]