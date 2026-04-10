<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Edit User</h1>
        <p class="subtitle">Update user account details, role, and status.</p>
      </div>
      <router-link to="/admin/users" class="btn btn-secondary">Back to Users</router-link>
    </div>

    <div class="card form-card">
      <p v-if="loading">Loading user...</p>
      <form v-else @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" v-model="form.username" type="text" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>
          <div class="form-group">
            <label for="password">New Password</label>
            <input id="password" v-model="form.password" type="password" placeholder="Leave blank to keep current password" />
          </div>
          <div class="form-group">
            <label for="roleId">Role</label>
            <select id="roleId" v-model="form.roleId" required>
              <option disabled value="">Select role</option>
              <option v-for="role in store.roles" :key="role.UserRoleID" :value="role.UserRoleID">
                {{ role.UserRoleName }}
              </option>
            </select>
          </div>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
          <router-link to="/admin/users" class="btn btn-secondary">Cancel</router-link>
        </div>
      </form>
    </div>

    <!-- 4.4: Account Status Panel -->
    <AccountStatusPanel
      v-if="store.selectedUser"
      :user="store.selectedUser"
      @updated="onStatusUpdated"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminUsersStore } from '../../stores/adminUsers';
import AccountStatusPanel from '../../components/admin/AccountStatusPanel.vue';

const route = useRoute();
const router = useRouter();
const store = useAdminUsersStore();

const loading = ref(true);
const submitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  username: '',
  email: '',
  password: '',
  roleId: '',
});

async function loadUser() {
  loading.value = true;
  errorMessage.value = '';
  try {
    await store.fetchRoles();
    await store.fetchUser(route.params.id);
    const user = store.selectedUser;
    form.username = user.Username;
    form.email = user.Email;
    form.password = '';
    form.roleId = user.userrolestable?.UserRoleID;
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Failed to load user';
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  errorMessage.value = '';
  submitting.value = true;
  try {
    const payload = {
      username: form.username,
      email: form.email,
      roleId: form.roleId,
    };
    if (form.password.trim()) payload.password = form.password;
    await store.updateUser(route.params.id, payload);
    router.push('/admin/users');
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Failed to update user';
  } finally {
    submitting.value = false;
  }
}

function onStatusUpdated(updatedUser) {
  // Refresh selectedUser so the panel reflects the new status immediately
  store.selectedUser = { ...store.selectedUser, ...updatedUser };
}

onMounted(loadUser);
</script>

<style scoped>
.page { padding: 24px; max-width: 900px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; }
.subtitle { color: #666; margin-top: 6px; }
.card { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 24px; }
.form-card { max-width: 760px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
input, select { padding: 10px 12px; border: 1px solid #ccc; border-radius: 8px; }
.form-actions { display: flex; gap: 12px; margin-top: 24px; }
.btn { display: inline-block; padding: 10px 14px; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; text-align: center; font-size: 14px; }
.btn-primary  { background: #1f6feb; color: #fff; }
.btn-secondary { background: #eaeaea; color: #222; }
.btn:disabled { opacity: 0.65; cursor: not-allowed; }
.error { margin-top: 16px; color: #b42318; font-weight: 600; }
</style>
