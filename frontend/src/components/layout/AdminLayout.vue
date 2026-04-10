<template>
  <div class="admin-layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
        <button class="close-btn mobile-only" @click="sidebarOpen = false">✕</button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" @click="sidebarOpen = false">
          Dashboard
        </router-link>

        <router-link to="/admin/users" class="nav-item" @click="sidebarOpen = false">
          Users
        </router-link>
      </nav>
    </aside>

    <div v-if="sidebarOpen" class="overlay mobile-only" @click="sidebarOpen = false"></div>

    <div class="main-area">
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-btn mobile-only" @click="sidebarOpen = true">☰</button>
          <h1 class="topbar-title">{{ title }}</h1>
        </div>

        <div class="topbar-right">
          <slot name="actions" />
        </div>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  title: {
    type: String,
    default: 'Admin',
  },
});

const sidebarOpen = ref(false);
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 250px;
  background: #111827;
  color: #fff;
  padding: 20px 16px;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.sidebar-header h2 {
  font-size: 20px;
  margin: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  color: #d1d5db;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  transition: 0.2s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: #1f2937;
  color: #fff;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  height: 72px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-title {
  font-size: 20px;
  margin: 0;
}

.content {
  padding: 24px;
}

.menu-btn,
.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: inherit;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 20;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .mobile-only {
    display: inline-block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .topbar {
    padding: 0 16px;
  }

  .content {
    padding: 16px;
  }
}
</style>