import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AdminLogin from '../views/AdminLogin.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    next();
  } else {
    next('/');
  }
}

function notFound(to, from, next) {
  next('/');
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // {
  //   path: '/adminlogin',
  //   name: 'AdminLogin',
  //   component: AdminLogin
  // },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: Dashboard,
  //   beforeEnter: isLoggedIn
  // },
  // {
  //   path: '/admin',
  //   name: 'Admin',
  //   component: Admin,
  //   beforeEnter: isLoggedIn
  // },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login,
  // },
  {
    path: '*',
    name: 'Not Found',
    beforeEnter: notFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
