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
    async fetchUsers(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get(`${API_URL}/admin/users`, { params: { page: this.page, limit: this.limit, ...params } });
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
  },
});