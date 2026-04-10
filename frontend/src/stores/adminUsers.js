import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useAdminUsersStore = defineStore('adminUsers', {
  state: () => ({
    users: [],
    total: 0,
    page: 1,
    limit: 20,
    selectedUser: null,
    roles: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers(params) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get(`${API_URL}/admin/users`, { params });
        this.users = data.users;
        this.total = data.total;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load users';
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(id) {
      this.loading = true;
      try {
        const { data } = await axios.get(`${API_URL}/admin/users/${id}`);
        this.selectedUser = data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load user';
      } finally {
        this.loading = false;
      }
    },

    async fetchRoles() {
      const { data } = await axios.get(`${API_URL}/admin/users/roles`);
      this.roles = data;
    },

    async createUser(payload) {
      const { data } = await axios.post(`${API_URL}/admin/users`, payload);
      await this.fetchUsers();
      return data;
    },

    async updateUser(id, payload) {
      const { data } = await axios.put(`${API_URL}/admin/users/${id}`, payload);
      await this.fetchUsers();
      return data;
    },

    async deleteUser(id) {
      await axios.delete(`${API_URL}/admin/users/${id}`);
      await this.fetchUsers();
    },

    // ── 4.4 Account Status Management ────────────────────────────────────────
    async updateAccountStatus(id, status, lockedUntil = null) {
      const payload = { status };
      if (lockedUntil) payload.lockedUntil = lockedUntil;
      const { data } = await axios.put(`${API_URL}/admin/users/${id}/status`, payload);
      // Update in local list without full refetch
      const idx = this.users.findIndex(u => u.UserID === data.UserID);
      if (idx !== -1) this.users[idx] = { ...this.users[idx], ...data };
      if (this.selectedUser?.UserID === data.UserID) this.selectedUser = { ...this.selectedUser, ...data };
      return data;
    },

    async unlockAccount(id) {
      const { data } = await axios.post(`${API_URL}/admin/users/${id}/unlock`);
      const idx = this.users.findIndex(u => u.UserID === data.UserID);
      if (idx !== -1) this.users[idx] = { ...this.users[idx], ...data };
      if (this.selectedUser?.UserID === data.UserID) this.selectedUser = { ...this.selectedUser, ...data };
      return data;
    },
  },
});
