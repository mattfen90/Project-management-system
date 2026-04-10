<template>
  <div class="reset-container">
    <div class="reset-card">
      <h2>Reset Password</h2>
      <p class="subtitle">Enter your new password below.</p>

      <div v-if="tokenMissing" class="alert alert-danger">
        Invalid or missing reset link. Please request a new one.
        <br />
        <router-link to="/forgot-password">Request new link</router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="password">New Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter new password"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Confirm new password"
            required
          />
        </div>

        <div v-if="validationError" class="alert alert-danger">
          {{ validationError }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div v-if="success" class="alert alert-success">
        Password reset successful.
        <router-link to="/login">Back to Login</router-link>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref('');
const validationError = ref('');
const tokenMissing = ref(false);
const token = ref('');

onMounted(() => {
  token.value = route.query.token || '';
  if (!token.value) {
    tokenMissing.value = true;
  }
});

const handleSubmit = async () => {
  validationError.value = '';
  error.value = '';

  if (password.value.length < 8) {
    validationError.value = 'Password must be at least 8 characters.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    validationError.value = 'Passwords do not match.';
    return;
  }

  try {
    loading.value = true;
    await axios.post('http://localhost:5000/api/auth/reset-password', {
      token: token.value,
      newPassword: password.value,
    });
    success.value = true;
    setTimeout(() => router.push('/login'), 3000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}
.reset-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 420px;
}
h2 { margin-bottom: 0.5rem; }
.subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.95rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.4rem; font-weight: 500; }
.form-control {
  width: 100%; padding: 0.6rem 0.8rem;
  border: 1px solid #ccc; border-radius: 4px; font-size: 1rem;
}
.form-control:focus { outline: none; border-color: #007bff; }
.btn-primary {
  width: 100%; padding: 0.7rem;
  background: #007bff; color: white;
  border: none; border-radius: 4px;
  font-size: 1rem; cursor: pointer; margin-top: 0.5rem;
}
.btn-primary:disabled { background: #6aabf7; cursor: not-allowed; }
.alert { padding: 0.75rem 1rem; border-radius: 4px; margin-top: 1rem; font-size: 0.9rem; }
.alert-success { background: #d4edda; color: #155724; }
.alert-danger { background: #f8d7da; color: #721c24; }
</style>