<template>
  <div class="page">
    <div class="page-intro">
      <p>Manage platform users, roles, and account statuses.</p>
    </div>

    <div class="card filters">
      <div class="filter-group">
        <label for="search">Search</label>
        <input
          id="search"
          v-model="filters.search"
          type="text"
          placeholder="Search by username or email"
          @keyup.enter="applyFilters"
        />
      </div>

      <div class="filter-group">
        <label for="role">Role</label>
        <select id="role" v-model="filters.role">
          <option value="">All Roles</option>
          <option
            v-for="role in store.roles"
            :key="role.UserRoleID"
            :value="role.UserRoleName"
          >
            {{ role.UserRoleName }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="status">Status</label>
        <select id="status" v-model="filters.status">
          <option value="">All Statuses</option>
          <option value="Pending Verification">Pending Verification</option>
          <option value="Active">Active</option>
          <option value="Locked">Locked</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>

      <div class="filter-actions">
        <button class="btn btn-primary" @click="applyFilters">Apply</button>
        <button class="btn btn-secondary" @click="resetFilters">Reset</button>
      </div>
    </div>

    <div class="card">
      <p v-if="store.loading" class="info-text">Loading users...</p>
      <p v-else-if="store.error" class="error-text">{{ store.error }}</p>
      <p v-else-if="!store.users.length" class="info-text">No users found.</p>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Email Verified</th>
              <th>Last Login</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in store.users" :key="user.UserID">
              <td>{{ user.UserID }}</td>
              <td>{{ user.Username }}</td>
              <td>{{ user.Email }}</td>
              <td>{{ user.userrolestable?.UserRoleName || '-' }}</td>
              <td>
                <span class="badge" :class="badgeClass(user.AccountStatus)">
                  {{ user.AccountStatus }}
                </span>
              </td>
              <td>{{ user.EmailVerified ? 'Yes' : 'No' }}</td>
              <td>{{ formatDate(user.LastLoginAt) }}</td>
              <td class="actions">
                <router-link
                  :to="`/admin/users/${user.UserID}/edit`"
                  class="btn btn-small btn-secondary"
                >
                  Edit
                </router-link>

                <button
                  class="btn btn-small btn-danger"
                  @click="removeUser(user)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="store.total > store.limit" class="pagination">
        <button
          class="btn btn-secondary"
          :disabled="store.page <= 1"
          @click="changePage(store.page - 1)"
        >
          Previous
        </button>

        <span class="page-indicator">
          Page {{ store.page }}
        </span>

        <button
          class="btn btn-secondary"
          :disabled="store.page * store.limit >= store.total"
          @click="changePage(store.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useAdminUsersStore } from '../../stores/adminUsers';

const store = useAdminUsersStore();

const filters = reactive({
  search: '',
  role: '',
  status: '',
});

async function loadUsers() {
  await store.fetchUsers({
    page: store.page,
    search: filters.search,
    role: filters.role,
    status: filters.status,
  });
}

async function applyFilters() {
  store.page = 1;
  await loadUsers();
}

async function changePage(page) {
  store.page = page;
  await loadUsers();
}

function resetFilters() {
  filters.search = '';
  filters.role = '';
  filters.status = '';
  store.page = 1;
  loadUsers();
}

async function removeUser(user) {
  const confirmed = window.confirm(
    `Are you sure you want to delete user "${user.Username}"?`
  );

  if (!confirmed) return;

  try {
    await store.deleteUser(user.UserID);

    if (store.users.length === 1 && store.page > 1) {
      store.page -= 1;
      await loadUsers();
    }
  } catch (error) {
    alert(error?.response?.data?.message || 'Failed to delete user');
  }
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function badgeClass(status) {
  switch (status) {
    case 'Active':
      return 'badge-success';
    case 'Locked':
      return 'badge-warning';
    case 'Disabled':
      return 'badge-danger';
    default:
      return 'badge-muted';
  }
}

onMounted(async () => {
  await store.fetchRoles();
  await loadUsers();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-intro {
  color: #6b7280;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
}

.filter-actions {
  display: flex;
  align-items: end;
  gap: 10px;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

th {
  color: #374151;
  font-size: 14px;
}

.actions-column {
  min-width: 140px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  font-size: 14px;
}

.btn-small {
  padding: 8px 10px;
}

.btn-primary {
  background: #1f6feb;
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge-muted {
  background: #f3f4f6;
  color: #4b5563;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.page-indicator {
  color: #374151;
  font-weight: 500;
}

.info-text {
  color: #4b5563;
}

.error-text {
  color: #b91c1c;
  font-weight: 600;
}
</style>