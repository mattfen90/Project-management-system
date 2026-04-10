<template>
  <div class="forgot-container">
    <div class="forgot-card">
      <h2>Forgot Password</h2>
      <p class="subtitle">
        Enter your email address and we will send you a password reset link.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div v-if="message" class="alert alert-success">
        {{ message }}
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <router-link to="/login" class="back-link">
        Back to Login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const loading = ref(false);
const message = ref('');
const error = ref('');

const handleSubmit = async () => {
  try {
    loading.value = true;
    message.value = '';
    error.value = '';

    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: email.value,
    });

    message.value = response.data.message;
    email.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.forgot-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forgot-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

.forgot-card h2 {
  margin-bottom: 0.75rem;
  text-align: center;
  color: #333;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.alert {
  padding: 0.75rem;
  border-radius: 5px;
  margin-top: 1rem;
  font-size: 0.95rem;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.back-link {
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: #007bff;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>