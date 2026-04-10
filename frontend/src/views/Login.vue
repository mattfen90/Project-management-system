<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <div class="form-group">
          <label>Username or Email</label>
          <Field
            name="identifier"
            class="form-control"
            :class="{ 'is-invalid': errors.identifier }"
            placeholder="Enter username or email"
          />
          <div class="invalid-feedback">{{ errors.identifier }}</div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <Field
            name="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Enter password"
          />
          <div class="invalid-feedback">{{ errors.password }}</div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
        <router-link to="/forgot-password" class="forgot-link">
          Forgot Password?
        </router-link>
        <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const error = ref('');

const schema = Yup.object().shape({
  identifier: Yup.string().required('Username or email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const onSubmit = async (values) => {
  try {
    error.value = '';
    await authStore.login(values.identifier, values.password);
  } catch (err) {
    error.value = err;
  }
};
</script>

<style scoped>

.forgot-link {
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: #007bff;
  text-decoration: none;
  font-size: 0.95rem;
}

.forgot-link:hover {
  text-decoration: underline;
}
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
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

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
