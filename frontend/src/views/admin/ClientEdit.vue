<template>
  <div class="page">
    <div class="page-intro">
      <p>Update the client's details below.</p>
    </div>

    <div v-if="store.loading" class="card">
      <p class="info-text">Loading client...</p>
    </div>

    <div v-else-if="store.error && !store.selectedClient" class="card">
      <p class="error-text">{{ store.error }}</p>
    </div>

    <div v-else class="card">
      <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success-text">{{ successMsg }}</p>

      <form class="form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="clientName">First Name <span class="required">*</span></label>
            <input id="clientName" v-model="form.clientName" type="text" required />
          </div>
          <div class="form-group">
            <label for="clientSurname">Surname</label>
            <input id="clientSurname" v-model="form.clientSurname" type="text" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="clientEmail">Email <span class="required">*</span></label>
            <input id="clientEmail" v-model="form.clientEmail" type="email" required />
          </div>
          <div class="form-group">
            <label for="clientType">Type <span class="required">*</span></label>
            <input id="clientType" v-model="form.clientType" type="text" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="clientTelephone">Telephone</label>
            <input id="clientTelephone" v-model="form.clientTelephone" type="text" />
          </div>
          <div class="form-group">
            <label for="clientMobile">Mobile</label>
            <input id="clientMobile" v-model="form.clientMobile" type="text" />
          </div>
        </div>

        <div class="form-group">
          <label for="clientWebsite">Website</label>
          <input id="clientWebsite" v-model="form.clientWebsite" type="text" />
        </div>

        <div class="form-group">
          <label for="clientAddress">Address</label>
          <textarea id="clientAddress" v-model="form.clientAddress" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="clientStatus">Status</label>
          <select id="clientStatus" v-model="form.clientStatus">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Archived">Archived</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea id="notes" v-model="form.notes" rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
          <router-link
            :to="`/admin/clients/${route.params.id}/link-user`"
            class="btn btn-secondary"
          >
            Link User
          </router-link>
          <router-link to="/admin/clients" class="btn btn-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminClientsStore } from '../../stores/adminClients';

const route = useRoute();
const store = useAdminClientsStore();

const submitting = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const form = reactive({
  clientName: '',
  clientSurname: '',
  clientEmail: '',
  clientTelephone: '',
  clientMobile: '',
  clientAddress: '',
  clientWebsite: '',
  clientType: '',
  clientStatus: 'Active',
  notes: '',
});

function populateForm(client) {
  form.clientName      = client.ClientName || '';
  form.clientSurname   = client.ClientSurname || '';
  form.clientEmail     = client.ClientEmail || '';
  form.clientTelephone = client.ClientTelephone || '';
  form.clientMobile    = client.ClientMobile || '';
  form.clientAddress   = client.ClientAddress || '';
  form.clientWebsite   = client.ClientWebsite || '';
  form.clientType      = client.ClientType || '';
  form.clientStatus    = client.ClientStatus || 'Active';
  form.notes           = client.Notes || '';
}

async function handleSubmit() {
  submitting.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  try {
    await store.updateClient(route.params.id, { ...form });
    successMsg.value = 'Client updated successfully.';
  } catch (err) {
    errorMsg.value = err?.response?.data?.message || 'Failed to update client';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await store.fetchClient(route.params.id);
  if (store.selectedClient) {
    populateForm(store.selectedClient);
  }
});
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-intro { color: #6b7280; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; }
.form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-weight: 600; color: #374151; font-size: 14px; }
.required { color: #dc2626; }
input, select, textarea { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; font-size: 14px; font-family: inherit; }
textarea { resize: vertical; }
.form-actions { display: flex; gap: 10px; flex-wrap: wrap; padding-top: 4px; }
.btn { display: inline-block; padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; text-align: center; font-size: 14px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: #1f6feb; color: white; }
.btn-secondary { background: #e5e7eb; color: #111827; }
.error-text { color: #b91c1c; font-weight: 600; }
.success-text { color: #166534; font-weight: 600; }
.info-text { color: #4b5563; }
</style>
