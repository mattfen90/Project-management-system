import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useAccountLinksStore = defineStore('accountLinks', {
  state: () => ({
    linkableUsers: [],
    loadingUsers: false,
    linking: false,
    error: null,
  }),

  actions: {
    async fetchLinkableUsers(role) {
      this.loadingUsers = true;
      this.error = null;

      try {
        const { data } = await axios.get(`${API_URL}/admin/account-links/users`, {
          params: { role },
        });

        this.linkableUsers = data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load linkable users';
      } finally {
        this.loadingUsers = false;
      }
    },

    async linkClientUser(clientId, userId) {
      this.linking = true;
      this.error = null;

      try {
        const { data } = await axios.put(
          `${API_URL}/admin/account-links/clients/${clientId}/link-user`,
          { userId }
        );
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to link client account';
        throw err;
      } finally {
        this.linking = false;
      }
    },

    async unlinkClientUser(clientId) {
      this.linking = true;
      this.error = null;

      try {
        const { data } = await axios.put(
          `${API_URL}/admin/account-links/clients/${clientId}/unlink-user`
        );
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to unlink client account';
        throw err;
      } finally {
        this.linking = false;
      }
    },

    async linkWorkerUser(workerId, userId) {
      this.linking = true;
      this.error = null;

      try {
        const { data } = await axios.put(
          `${API_URL}/admin/account-links/workers/${workerId}/link-user`,
          { userId }
        );
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to link worker account';
        throw err;
      } finally {
        this.linking = false;
      }
    },

    async unlinkWorkerUser(workerId) {
      this.linking = true;
      this.error = null;

      try {
        const { data } = await axios.put(
          `${API_URL}/admin/account-links/workers/${workerId}/unlink-user`
        );
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to unlink worker account';
        throw err;
      } finally {
        this.linking = false;
      }
    },
  },
});