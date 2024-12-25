export const overviewPaths = [{
  path: "/overview",
  name: "Overview",
  component: () => import('@/domains/overview/views/OverviewBase.vue'),
  meta: { requiresAuth: true },
  children: []
}]