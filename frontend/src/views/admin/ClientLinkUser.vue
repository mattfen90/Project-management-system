<template>
  <div class="page">
    <div class="page-intro">
      <p>Link a platform user account to this client. Only users with the <strong>Client</strong> role that are not yet linked will appear.</p>
    </div>

    <div v-if="loadingClient" class="card">
      <p class="info-text">Loading client details...</p>
    </div>

    <div v-else-if="!client" class="card">
      <p class="error-text">Client not found.</p>
    </div>

    <template v-else>
      <!-- Client Info -->
      <div class="card client-info">
        <div class="info-row">
          <span class="info-label">Client</span>
          <span class="info-value">{{ client.ClientName }} {{ client.ClientSurname || '' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">{{ client.ClientEmail }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="badge" :class="clientBadgeClass(client.ClientStatus)">{{ client.ClientStatus }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Linked User</span>
          <span v-if="client.usertable" class="info-value linked">
            {{ client.usertable.Username }} ({{ client.usertable.Email }})
            <button class="btn btn-small btn-danger" :disabled="store.linking" @click="handleUnlink">
              {{ store.linking ? 'Unlinking...' : 'Unlink' }}
            </button>
          </span>
          <span v-else class="info-value muted">No user linked</span>
        </div>
      </div>

      <!-- Link Form -->
      <div class="card">
        <h3 class="section-title">Link a User Account</h3>

        <p v-if="store.error" class="error-text">{{ store.error }}</p>

        <div v-if="store.loadingUsers" class="info-text"><p>Loading available users...</p></div>
        <div v-else-if="!store.linkableUsers.length" class="info-text">No unlinked Client users available.</div>

        <div v-else class="link-form">
          <div class="filter-group">
            <label for="userSelect">Select User</label>
            <select id="userSelect" v-model="selectedUserId">
              <option value="">-- Choose a user --</option>
              <option
                v-for="u in store.linkableUsers"
                :key="u.UserID"
                :value="u.UserID"
              >
                {{ u.Username }} — {{ u.Email }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button
              class="btn btn-primary"
              :disabled="!selectedUserId || store.linking"
              @click="handleLink"
            >
              {{ store.linking ? 'Linking...' : 'Link User' }}
            </button>
            <router-link to="/admin/clients" class="btn btn-secondary">Cancel</router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAccountLinksStore } from '../../stores/accountLinks';

const route = useRoute();
const router = useRouter();
const store = useAccountLinksStore();

const client = ref(null);
const loadingClient = ref(true);
const selectedUserId = ref('');

const API_URL = 'http://localhost:5000/api';

async function loadClient() {
  try {
    const { data } = await axios.get(`${API_URL}/admin/clients/${route.params.id}`);
    client.value = data;
  } catch {
    client.value = null;
  } finally {
    loadingClient.value = false;
  }
}

async function handleLink() {
  if (!selectedUserId.value) return;
  try {
    await store.linkClientUser(route.params.id, selectedUserId.value);
    await loadClient();
    await store.fetchLinkableUsers('Client');
    selectedUserId.value = '';
  } catch {
    // error already in store.error
  }
}

async function handleUnlink() {
  const confirmed = window.confirm('Are you sure you want to unlink this user from the client?');
  if (!confirmed) return;
  try {
    await store.unlinkClientUser(route.params.id);
    await loadClient();
    await store.fetchLinkableUsers('Client');
  } catch {
    // error already in store.error
  }
}

function clientBadgeClass(status) {
  switch (status) {
    case 'Active': return 'badge-success';
    case 'Inactive': return 'badge-warning';
    default: return 'badge-muted';
  }
}

onMounted(async () => {
  await Promise.all([
    loadClient(),
    store.fetchLinkableUsers('Client'),
  ]);
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

.client-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.info-value {
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-value.muted {
  color: #9ca3af;
}

.info-value.linked {
  color: #166534;
  font-weight: 500;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
}

.link-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 420px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
}

select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-small {
  padding: 6px 10px;
  font-size: 13px;
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

.badge-success { background: #dcfce7; color: #166534; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-muted   { background: #f3f4f6; color: #4b5563; }

.info-text { color: #4b5563; }
.error-text { color: #b91c1c; font-weight: 600; }
</style>
