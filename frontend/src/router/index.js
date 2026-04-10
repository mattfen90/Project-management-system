import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Unauthorized from '../views/Unauthorized.vue';
import VerifyEmail from '../views/VerifyEmail.vue';

import AdminLayout from '../views/admin/AdminLayout.vue';
import UserList from '../views/admin/UserList.vue';
import UserCreate from '../views/admin/UserCreate.vue';
import UserEdit from '../views/admin/UserEdit.vue';

const PUBLIC_ROUTES = ['login', 'forgot-password', 'reset-password', 'unauthorized', 'verify-email'];

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
  { path: '/reset-password', name: 'reset-password', component: ResetPassword },
  { path: '/verify-email', name: 'verify-email', component: VerifyEmail },
  { path: '/unauthorized', name: 'unauthorized', component: Unauthorized },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['Admin'] },
    children: [
      {
        path: 'users',
        name: 'admin-users',
        component: UserList,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'User Management',
          subtitle: 'Manage platform users, roles, and account statuses.',
          showCreateButton: true,
        },
      },
      {
        path: 'users/create',
        name: 'admin-users-create',
        component: UserCreate,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'Create User',
          subtitle: 'Add a new user account for the platform.',
        },
      },
      {
        path: 'users/:id/edit',
        name: 'admin-users-edit',
        component: UserEdit,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'Edit User',
          subtitle: 'Update user account details, role, and status.',
        },
      },
    ],
  },

  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
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

  if (isLoggedIn && ['login', 'forgot-password', 'reset-password'].includes(to.name)) {
    return next('/dashboard');
  }

  if (!isLoggedIn && !isPublic) {
    return next('/login');
  }

  const allowedRoles = to.meta?.roles;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return next('/unauthorized');
  }

  next();
});

export default router;