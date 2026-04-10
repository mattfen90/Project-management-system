<template>
  <div class="page">
    <div class="page-intro">
      <p>Update user account details, role, and status.</p>
    </div>

    <div v-if="loading" class="loading-card">
      Loading user...
    </div>

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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminUsersStore } from '../../stores/adminUsers';
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

    if (form.password && form.password.trim()) {
      payload.password = form.password.trim();
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
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-intro {
  color: #6b7280;
}

.loading-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  color: #4b5563;
}
</style>