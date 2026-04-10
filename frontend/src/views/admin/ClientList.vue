<template>
  <div class="page">
    <div class="page-intro">
      <p>Manage clients, their details, statuses, and linked user accounts.</p>
    </div>

    <div class="card filters">
      <div class="filter-group">
        <label for="search">Search</label>
        <input
          id="search"
          v-model="filters.search"
          type="text"
          placeholder="Search by name or email"
          @keyup.enter="applyFilters"
        />
      </div>

      <div class="filter-group">
        <label for="type">Type</label>
        <input
          id="type"
          v-model="filters.type"
          type="text"
          placeholder="e.g. Individual, Company"
        />
      </div>

      <div class="filter-group">
        <label for="status">Status</label>
        <select id="status" v-model="filters.status">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Archived">Archived</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div class="filter-actions">
        <button class="btn btn-primary" @click="applyFilters">Apply</button>
        <button class="btn btn-secondary" @click="resetFilters">Reset</button>
      </div>
    </div>

    <div class="card">
      <p v-if="store.loading" class="info-text">Loading clients...</p>
      <p v-else-if="store.error" class="error-text">{{ store.error }}</p>
      <p v-else-if="!store.clients.length" class="info-text">No clients found.</p>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Type</th>
              <th>Status</th>
              <th>Linked User</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in store.clients" :key="client.ClientID">
              <td>{{ client.ClientID }}</td>
              <td>{{ client.ClientName }} {{ client.ClientSurname || '' }}</td>
              <td>{{ client.ClientEmail }}</td>
              <td>{{ client.ClientTelephone || '-' }}</td>
              <td>{{ client.ClientType }}</td>
              <td>
                <span class="badge" :class="badgeClass(client.ClientStatus)">
                  {{ client.ClientStatus }}
                </span>
              </td>
              <td>
                <span v-if="client.usertable" class="linked-user">
                  {{ client.usertable.Username }}
                </span>
                <span v-else class="muted">—</span>
              </td>
              <td class="actions">
                <router-link
                  :to="`/admin/clients/${client.ClientID}/edit`"
                  class="btn btn-small btn-secondary"
                >
                  Edit
                </router-link>
                <router-link
                  :to="`/admin/clients/${client.ClientID}/link-user`"
                  class="btn btn-small btn-secondary"
                >
                  Link User
                </router-link>
                <button
                  class="btn btn-small btn-danger"
                  @click="removeClient(client)"
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
        <span class="page-indicator">Page {{ store.page }}</span>
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
import { useAdminClientsStore } from '../../stores/adminClients';

const store = useAdminClientsStore();

const filters = reactive({ search: '', type: '', status: '' });

async function loadClients() {
  await store.fetchClients({
    page: store.page,
    search: filters.search,
    type: filters.type,
    status: filters.status,
  });
}

async function applyFilters() {
  store.page = 1;
  await loadClients();
}

async function changePage(page) {
  store.page = page;
  await loadClients();
}

function resetFilters() {
  filters.search = '';
  filters.type = '';
  filters.status = '';
  store.page = 1;
  loadClients();
}

async function removeClient(client) {
  const confirmed = window.confirm(
    `Are you sure you want to delete client "${client.ClientName}"?`
  );
  if (!confirmed) return;
  try {
    await store.deleteClient(client.ClientID);
    if (store.clients.length === 1 && store.page > 1) {
      store.page -= 1;
      await loadClients();
    }
  } catch (error) {
    alert(error?.response?.data?.message || 'Failed to delete client');
  }
}

function badgeClass(status) {
  switch (status) {
    case 'Active':   return 'badge-success';
    case 'Inactive': return 'badge-warning';
    case 'Blocked':  return 'badge-danger';
    default:         return 'badge-muted';
  }
}

onMounted(() => loadClients());
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-intro { color: #6b7280; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
.filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.filter-group { display: flex; flex-direction: column; gap: 8px; }
.filter-group label { font-weight: 600; color: #374151; }
.filter-actions { display: flex; align-items: end; gap: 10px; }
input, select { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; font-size: 14px; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
th { color: #374151; font-size: 14px; }
.actions-column { min-width: 180px; }
.actions { display: flex; gap: 8px; flex-wrap: wrap; }
.linked-user { font-weight: 500; color: #166534; }
.muted { color: #9ca3af; }
.btn { display: inline-block; padding: 10px 14px; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; text-align: center; font-size: 14px; }
.btn-small { padding: 6px 10px; font-size: 13px; }
.btn-primary { background: #1f6feb; color: white; }
.btn-secondary { background: #e5e7eb; color: #111827; }
.btn-danger { background: #dc2626; color: white; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.badge-success { background: #dcfce7; color: #166534; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-danger  { background: #fee2e2; color: #991b1b; }
.badge-muted   { background: #f3f4f6; color: #4b5563; }
.pagination { display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 20px; }
.page-indicator { color: #374151; font-weight: 500; }
.info-text { color: #4b5563; }
.error-text { color: #b91c1c; font-weight: 600; }
</style>
