export const receitasPaths = [{
  path: "/receitas",
  name: "Receitas",
  component: () => import('@/domains/receitas/views/ReceitasPage.vue'),
  meta: { requiresAuth: true },
  children: []
}]