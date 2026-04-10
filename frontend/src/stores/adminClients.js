import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useAdminClientsStore = defineStore('adminClients', {
  state: () => ({
    clients: [],
    total: 0,
    page: 1,
    limit: 20,
    selectedClient: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchClients(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get(`${API_URL}/admin/clients`, {
          params: { page: this.page, limit: this.limit, ...params },
        });
        this.clients = data.clients;
        this.total = data.total;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load clients';
      } finally {
        this.loading = false;
      }
    },

    async fetchClient(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get(`${API_URL}/admin/clients/${id}`);
        this.selectedClient = data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load client';
      } finally {
        this.loading = false;
      }
    },

    async createClient(payload) {
      const { data } = await axios.post(`${API_URL}/admin/clients`, payload);
      await this.fetchClients();
      return data;
    },

    async updateClient(id, payload) {
      const { data } = await axios.put(`${API_URL}/admin/clients/${id}`, payload);
      await this.fetchClients();
      return data;
    },

    async deleteClient(id) {
      await axios.delete(`${API_URL}/admin/clients/${id}`);
      await this.fetchClients();
    },
  },
});
