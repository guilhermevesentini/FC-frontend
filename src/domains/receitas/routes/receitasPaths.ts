export const receitasPaths = [{
  path: "/receitas",
  name: "Receitas",
  component: () => import('@/domains/receitas/ReceitasBase.vue'),
  meta: { requiresAuth: true }
}]