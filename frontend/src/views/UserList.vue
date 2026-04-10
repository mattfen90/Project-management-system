<template>
  <AdminLayout title="User Management">
    <template #actions>
      <router-link to="/admin/users/create" class="btn btn-primary">
        Create User
      </router-link>
    </template>

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
          @keyup.enter="loadUsers"
        />
      </div>

      <div class="filter-group">
        <label for="role">Role</label>
        <select id="role" v-model="filters.role">
          <option value="">All Roles</option>
          <option v-for="role in store.roles" :key="role.UserRoleID" :value="role.UserRoleName">
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
        <button class="btn btn-primary" @click="loadUsers">Apply</button>
        <button class="btn btn-secondary" @click="resetFilters">Reset</button>
      </div>
    </div>

    <div class="card">
      <p v-if="store.loading">Loading users...</p>
      <p v-else-if="store.error" class="error">{{ store.error }}</p>
      <p v-else-if="!store.users.length">No users found.</p>

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
              <th>Actions</th>
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

                <button class="btn btn-small btn-danger" @click="removeUser(user)">
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

        <span>Page {{ store.page }}</span>

        <button
          class="btn btn-secondary"
          :disabled="store.page * store.limit >= store.total"
          @click="changePage(store.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useAdminUsersStore } from '../../stores/adminUsers';
import AdminLayout from '../../components/layout/AdminLayout.vue';

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
  const confirmed = window.confirm(`Are you sure you want to delete user "${user.Username}"?`);
  if (!confirmed) return;

  try {
    await store.deleteUser(user.UserID);
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
.page-intro {
  margin-bottom: 20px;
  color: #666;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
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

.filter-actions {
  display: flex;
  align-items: end;
  gap: 10px;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
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
  border-bottom: 1px solid #eee;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-block;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
}

.btn-small {
  padding: 8px 10px;
  font-size: 14px;
}

.btn-primary {
  background: #1f6feb;
  color: white;
}

.btn-secondary {
  background: #eaeaea;
  color: #222;
}

.btn-danger {
  background: #d93025;
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
  background: #d1fadf;
  color: #067647;
}

.badge-warning {
  background: #fef0c7;
  color: #b54708;
}

.badge-danger {
  background: #fee4e2;
  color: #b42318;
}

.badge-muted {
  background: #f2f4f7;
  color: #475467;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.error {
  color: #b42318;
  font-weight: 600;
}
</style>