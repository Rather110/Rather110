// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './firebase'

// Import views
import AdminDashboard from './views/AdminDashboard.vue'
import Dashboard from './views/Dashboard.vue'
import DashboardAdd from './views/DashboardAdd.vue'
import DashboardStatistic from './views/DashboardStatistic.vue'
import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Homepage from './views/Homepage.vue'
import ProductList from './views/ProductList.vue'
import ProductView from './views/ProductView.vue'

const routes = [
  { path: '/', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/account', name: 'Dashboard', component: Dashboard },
  { path: '/add', name: 'DashboardAdd', component: DashboardAdd },
  { path: '/statistic', name: 'DashboardStatistic', component: DashboardStatistic },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/user', name: 'UserHomepage', component: Homepage },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/product/:id', name: 'ProductView', component: ProductView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup']
  const authRequired = !publicPages.includes(to.path)
  const user = auth.currentUser

  if (authRequired && !user) {
    return next('/login')
  }

  next()
})

export default router
