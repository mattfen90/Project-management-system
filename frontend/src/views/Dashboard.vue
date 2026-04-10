<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Project Management System</h1>
      <div class="user-info">
        <span>Welcome, <strong>{{ user?.username }}</strong> ({{ user?.role }})</span>
        <button class="btn-logout" @click="logout">Logout</button>
      </div>
    </header>
    <main class="dashboard-content">
      <h2>Dashboard</h2>
      <p>You are logged in successfully. Dashboard coming soon.</p>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.dashboard-header {
  background: #007bff;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-logout {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
  padding: 0.4rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.3);
}

.dashboard-content {
  padding: 2rem;
}
</style>
