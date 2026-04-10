<template>
    <div class="dashboard">
        <h2>Dashboard</h2>
        <p>Welcome, {{ user?.username || 'User'}}! </p>
        <button @click="logout">Logout</button>
    
    </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const user = authStore.user;

const logout = () => {
    authStore.logout();
};

</script>