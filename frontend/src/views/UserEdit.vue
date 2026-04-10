<template>
  <AdminLayout title="Edit User">
    <template #actions>
      <router-link to="/admin/users" class="btn btn-secondary">
        Back to Users
      </router-link>
    </template>

    <div class="page-intro">
      <p>Update user account details, role, and status.</p>
    </div>

    <p v-if="loading" class="loading-text">Loading user...</p>

    <UserForm
      v-else
      v-model="form"
      :roles="store.roles"
      :error="errorMessage"
      :loading="submitting"
      :is-edit="true"
      submit-label="Save Changes"
      loading-label="Saving..."
      @submit="submitForm"
      @cancel="goBack"
    />
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminUsersStore } from '../../stores/adminUsers';
import AdminLayout from '../../components/layout/AdminLayout.vue';
import UserForm from '../../components/admin/UserForm.vue';

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
  accountStatus: 'Pending Verification',
});

async function loadUser() {
  loading.value = true;
  errorMessage.value = '';

  try {
    await store.fetchRoles();
    await store.fetchUser(route.params.id);

    const user = store.selectedUser;

    form.username = user.Username || '';
    form.email = user.Email || '';
    form.password = '';
    form.roleId = user.userrolestable?.UserRoleID || '';
    form.accountStatus = user.AccountStatus || 'Pending Verification';
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
      accountStatus: form.accountStatus,
    };

    if (form.password?.trim()) {
      payload.password = form.password;
    }

    await store.updateUser(route.params.id, payload);
    router.push('/admin/users');
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Failed to update user';
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push('/admin/users');
}

onMounted(() => {
  loadUser();
});
</script>

<style scoped>
.page-intro {
  margin-bottom: 20px;
  color: #666;
}

.loading-text {
  color: #444;
}

.btn {
  display: inline-block;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
}

.btn-secondary {
  background: #eaeaea;
  color: #222;
}
</style>