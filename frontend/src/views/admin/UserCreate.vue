<template>
  <div class="page">
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminUsersStore } from '../../stores/adminUsers';
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
    await store.createUser({
      username: form.username,
      email: form.email,
      password: form.password,
      roleId: form.roleId,
      accountStatus: form.accountStatus,
    });

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
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-intro {
  color: #6b7280;
}
</style>