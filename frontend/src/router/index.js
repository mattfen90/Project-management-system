import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Unauthorized from '../views/Unauthorized.vue';
import VerifyEmail from '../views/VerifyEmail.vue';
import UserList from '../views/UserList.vue';
import UserEdit from '../views/UserEdit.vue';
import UserCreate from '../views/UserCreate.vue';

// Public routes — accessible without a token
const PUBLIC_ROUTES = ['login', 'forgot-password', 'reset-password', 'unauthorized', 'verify-email'];

const routes = [
  // Auth
  { path: '/login',           name: 'login',           component: Login },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
  { path: '/reset-password',  name: 'reset-password',  component: ResetPassword },
  { path: '/verify-email',    name: 'verify-email',    component: VerifyEmail },
  { path: '/unauthorized',    name: 'unauthorized',    component: Unauthorized },
  { path: '/admin/users',          name: 'admin-users',        component: UserList,   meta: { requiresAuth: true, roles: ['Admin'] } },
{ path: '/admin/users/create',   name: 'admin-users-create', component: UserCreate, meta: { requiresAuth: true, roles: ['Admin'] } },
{ path: '/admin/users/:id/edit', name: 'admin-users-edit',   component: UserEdit,   meta: { requiresAuth: true, roles: ['Admin'] } },

  // Protected — all authenticated roles
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  // Catch-all redirect
  { path: '/:pathMatch(.*)*', redirect: '/login' },
  { path: '/', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadUserFromStorage();

  const isPublic = PUBLIC_ROUTES.includes(to.name);
  const isLoggedIn = !!authStore.user;
  const userRole = authStore.user?.role;

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && ['login', 'forgot-password', 'reset-password'].includes(to.name)) {
    return next('/dashboard');
  }

  // Block unauthenticated users from protected routes
  if (!isLoggedIn && !isPublic) {
    return next('/login');
  }

  // Role-based access check
  const allowedRoles = to.meta?.roles;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return next('/unauthorized');
  }

  next();
});

export default router;
