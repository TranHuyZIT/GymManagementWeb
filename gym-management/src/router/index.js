import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// const requireAuth = (to, from, next) => {
//   const isAuthenticated = true // replace with your authentication logic
//   if (isAuthenticated) {
//     next() // allow access to the route
//   } else {
//     next('/login') // redirect to the login page
//   }
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/customer'
        },
        {
          path: '/pt'
        },
        {
          path: '/cart'
        }
      ]
      // beforeEnter: requireAuth
    },
    {
      path: '/admin',
      children: [
        {
          path: '/pt'
        },
        {
          path: '/invoices'
        },
        {
          path: '/stat'
        }
      ]
    }
  ]
})

export default router
