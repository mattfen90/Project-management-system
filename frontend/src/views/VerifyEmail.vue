<template>
  <div class="verify-container">
    <div class="verify-card">

      <!-- Loading -->
      <div v-if="status === 'loading'" class="state">
        <div class="spinner"></div>
        <p>Verifying your email...</p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="state">
        <div class="icon icon-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h2>Email Verified!</h2>
        <p>Your email has been verified successfully.</p>
        <router-link to="/login" class="btn btn-primary">Go to Login</router-link>
      </div>

      <!-- Already verified -->
      <div v-else-if="status === 'already'" class="state">
        <div class="icon icon-info">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Already Verified</h2>
        <p>Your email is already verified.</p>
        <router-link to="/login" class="btn btn-primary">Go to Login</router-link>
      </div>

      <!-- Error / Expired -->
      <div v-else-if="status === 'error'" class="state">
        <div class="icon icon-error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2>Verification Failed</h2>
        <p>{{ errorMessage }}</p>
        <router-link to="/login" class="btn btn-secondary">Back to Login</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const status = ref('loading');
const errorMessage = ref('');

onMounted(async () => {
  const token = route.query.token || '';

  if (!token) {
    status.value = 'error';
    errorMessage.value = 'No verification token found in the link.';
    return;
  }

  try {
    const res = await axios.get(`http://localhost:5000/api/auth/verify-email`, {
      params: { token },
    });

    if (res.data.message === 'Email is already verified') {
      status.value = 'already';
    } else {
      status.value = 'success';
    }
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err.response?.data?.message || 'Something went wrong. Please try again.';
  }
});
</script>

<style scoped>
.verify-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}
.verify-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  max-width: 420px;
  width: 100%;
  text-align: center;
}
.state { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.icon { display: flex; justify-content: center; }
.icon-success { color: #38a169; }
.icon-info    { color: #3182ce; }
.icon-error   { color: #e53e3e; }
h2 { font-size: 1.4rem; margin: 0; }
p  { color: #555; margin: 0; }
.btn {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.65rem 1.5rem;
  border-radius: 4px;
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
  border: none;
}
.btn-primary   { background: #007bff; color: white; }
.btn-primary:hover { background: #0056b3; }
.btn-secondary { background: #e2e8f0; color: #333; }
.btn-secondary:hover { background: #cbd5e0; }
.spinner {
  width: 40px; height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
