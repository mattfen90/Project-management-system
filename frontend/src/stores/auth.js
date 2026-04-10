import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router/index.js';

const API_URL = 'http://localhost:5000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    async login(identifier, password) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          identifier,
          password,
        });

        this.user = response.data.user;
        this.token = response.data.token;

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        router.push('/dashboard');
      } catch (error) {
        throw error.response?.data?.message || 'Login failed';
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    },

    loadUserFromStorage() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
  },
});
