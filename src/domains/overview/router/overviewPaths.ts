export const overviewPaths = [{
  path: "/overview",
  name: "Overview",
  component: () => import('@/domains/overview/OverviewBase.vue'),
  meta: { requiresAuth: true }
}]