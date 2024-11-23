export const despesasPaths = [{
  path: "/Despesas",
  name: "Despesas",
  redirect: '/Despesas/overview',
  component: () => import('@/domains/despesas/DespesasBase.vue'),
  meta: { requiresAuth: true },
  children: [
    {
      path: "/Despesas/overview",
      name: "Overview",
      component: () => import('@/domains/despesas/views/overview/DespesasOverview.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: "/Despesas/lista",
      name: "Lista de Despesas",
      component: () => import('@/domains/despesas/views/lista/DespesasPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: "/Despesas/config",
      name: "Configuração",
      component: () => import('@/domains/despesas/views/config/DespesasConfig.vue'),
      meta: { requiresAuth: true },
    },
  ]
}]