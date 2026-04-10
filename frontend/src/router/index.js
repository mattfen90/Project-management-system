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
import ClientLinkUser from '../views/admin/ClientLinkUser.vue';
import WorkerLinkUser from '../views/admin/WorkerLinkUser.vue';
import ClientList from '../views/admin/ClientList.vue';
import ClientCreate from '../views/admin/ClientCreate.vue';
import ClientEdit from '../views/admin/ClientEdit.vue';

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
      // ── User Management ──────────────────────────────────────
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
          createRoute: 'admin-users-create',
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

      // ── Account Linking ───────────────────────────────────────
      {
        path: 'clients/:id/link-user',
        name: 'admin-clients-link-user',
        component: ClientLinkUser,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'Link User to Client',
          subtitle: 'Attach a platform user account to this client record.',
        },
      },
      {
        path: 'workers/:id/link-user',
        name: 'admin-workers-link-user',
        component: WorkerLinkUser,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'Link User to Worker',
          subtitle: 'Attach a platform user account to this worker record.',
        },
      },

      // ── Client Management ─────────────────────────────────────
      {
        path: 'clients',
        name: 'admin-clients',
        component: ClientList,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'Client Management',
          subtitle: 'Manage clients, their details, and linked user accounts.',
          showCreateButton: true,
          createRoute: 'admin-clients-create',
        },
      },
      {
        path: 'clients/create',
        name: 'admin-clients-create',
        component: ClientCreate,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'Create Client',
          subtitle: 'Add a new client record to the platform.',
        },
      },
      {
        path: 'clients/:id/edit',
        name: 'admin-clients-edit',
        component: ClientEdit,
        meta: {
          requiresAuth: true,
          roles: ['Admin'],
          title: 'Edit Client',
          subtitle: 'Update client details and status.',
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
