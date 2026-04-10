<template>
  <div class="admin-layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
        <button class="close-btn mobile-only" @click="sidebarOpen = false">✕</button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" @click="closeSidebar">
          Dashboard
        </router-link>

        <router-link to="/admin/users" class="nav-item" @click="closeSidebar">
          Users
        </router-link>
      </nav>
    </aside>

    <div
      v-if="sidebarOpen"
      class="overlay mobile-only"
      @click="sidebarOpen = false"
    ></div>

    <div class="main-area">
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-btn mobile-only" @click="sidebarOpen = true">☰</button>

          <div>
            <h1 class="topbar-title">{{ pageTitle }}</h1>
            <p v-if="pageSubtitle" class="topbar-subtitle">
              {{ pageSubtitle }}
            </p>
          </div>
        </div>

        <div class="topbar-right">
          <router-link
            v-if="showCreateButton"
            to="/admin/users/create"
            class="btn btn-primary"
          >
            Create User
          </router-link>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sidebarOpen = ref(false);

const pageTitle = computed(() => route.meta?.title || 'Admin');
const pageSubtitle = computed(() => route.meta?.subtitle || '');
const showCreateButton = computed(() => route.meta?.showCreateButton || false);

function closeSidebar() {
  sidebarOpen.value = false;
}
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
  color: white;
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
  margin: 0;
  font-size: 20px;
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
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: #1f2937;
  color: white;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  min-height: 72px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-title {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.topbar-subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.content {
  padding: 24px;
}

.menu-btn,
.close-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 22px;
  cursor: pointer;
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

.btn {
  display: inline-block;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  font-size: 14px;
}

.btn-primary {
  background: #1f6feb;
  color: white;
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
    padding: 16px;
  }

  .content {
    padding: 16px;
  }
}
</style>