export const dashboardPaths = [{
  path: "/dashboard",
  name: "Dashboard",
  component: () => import('@/domains/dashboard/DashboardPage.vue'),
  meta: { requiresAuth: true },
}]