import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';

const routes = [
 { path: '/login', name: 'login', component: Login },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
  { path: '/reset-password', name: 'reset-password', component: ResetPassword },

  { path: '/', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadUserFromStorage();

  if (!authStore.user && !['login', 'forgot-password', 'reset-password'].includes(to.name)) {
    next('/login');
  } else if (authStore.user && ['login', 'forgot-password', 'reset-password'].includes(to.name)) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;