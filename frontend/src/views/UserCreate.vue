<template>
  <AdminLayout title="Create User">
    <template #actions>
      <router-link to="/admin/users" class="btn btn-secondary">
        Back to Users
      </router-link>
    </template>

    <div class="page-intro">
      <p>Add a new user account for the platform.</p>
    </div>

    <UserForm
      v-model="form"
      :roles="store.roles"
      :error="errorMessage"
      :loading="submitting"
      submit-label="Create User"
      loading-label="Creating..."
      @submit="submitForm"
      @cancel="goBack"
    />
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminUsersStore } from '../../stores/adminUsers';
import AdminLayout from '../../components/layout/AdminLayout.vue';
import UserForm from '../../components/admin/UserForm.vue';

const router = useRouter();
const store = useAdminUsersStore();

const submitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  username: '',
  email: '',
  password: '',
  roleId: '',
  accountStatus: 'Pending Verification',
});

async function submitForm() {
  errorMessage.value = '';
  submitting.value = true;

  try {
    await store.createUser({ ...form });
    router.push('/admin/users');
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Failed to create user';
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push('/admin/users');
}

onMounted(async () => {
  await store.fetchRoles();
});
</script>

<style scoped>
.page-intro {
  margin-bottom: 20px;
  color: #666;
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