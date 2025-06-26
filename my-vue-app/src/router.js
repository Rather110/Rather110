import { createRouter, createWebHistory } from 'vue-router'

import AdminDashboard from './views/AdminDashboard.vue'
import Dashboard from './views/Dashboard.vue'
import DashboardAdd from './views/DashboardAdd.vue'
import DashboardStatistic from './views/DashboardStatistic.vue'
import Login from './views/Login.vue' // ✅ Add this line (create file if needed)

const routes = [
  { path: '/', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/account', name: 'Dashboard', component: Dashboard },
  { path: '/add', name: 'DashboardAdd', component: DashboardAdd },
  { path: '/statistic', name: 'DashboardStatistic', component: DashboardStatistic },
  { path: '/login', name: 'Login', component: Login } // ✅ Add this route
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
