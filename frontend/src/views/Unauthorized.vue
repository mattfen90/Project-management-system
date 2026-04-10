<template>
  <div class="unauthorized-container">
    <div class="unauthorized-card">
      <div class="icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2>Access Denied</h2>
      <p>You don't have permission to view this page.</p>
      <div class="actions">
        <button class="btn btn-primary" @click="goBack">Go Back</button>
        <button class="btn btn-secondary" @click="goHome">Go to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goBack = () => router.back();
const goHome = () => router.push('/dashboard');
</script>

<style scoped>
.unauthorized-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}
.unauthorized-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}
.icon {
  color: #e53e3e;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}
h2 { margin-bottom: 0.5rem; font-size: 1.5rem; }
p { color: #666; margin-bottom: 2rem; }
.actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.btn {
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
}
.btn-primary { background: #007bff; color: white; }
.btn-primary:hover { background: #0056b3; }
.btn-secondary { background: #e2e8f0; color: #333; }
.btn-secondary:hover { background: #cbd5e0; }
</style>
