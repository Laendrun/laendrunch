import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Error404 from '../views/Error404.vue'

Vue.use(VueRouter)

function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    next();
  } else {
    next('/');
  }
}

function notFound(to, from, next) {
  next('/404');
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/404',
    name: '404',
    component: Error404,
  },
  {
    path: '*',
    name: 'Not Found',
    beforeEnter: notFound,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
