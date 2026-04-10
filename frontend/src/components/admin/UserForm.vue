<template>
  <div class="card form-card">
    <form @submit.prevent="$emit('submit')" class="form">
      <div class="form-grid">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            :value="modelValue.username"
            required
            @input="updateField('username', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            :value="modelValue.email"
            required
            @input="updateField('email', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <label for="password">
            {{ isEdit ? 'New Password' : 'Password' }}
          </label>
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            :value="modelValue.password"
            :placeholder="isEdit ? 'Leave blank to keep current password' : 'Enter password'"
            :required="!isEdit"
            @input="updateField('password', $event.target.value)"
          />
          <button
            type="button"
            class="text-btn"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'Hide' : 'Show' }} password
          </button>
        </div>

        <div class="form-group">
          <label for="roleId">Role</label>
          <select
            id="roleId"
            :value="modelValue.roleId"
            required
            @change="updateField('roleId', $event.target.value)"
          >
            <option disabled value="">Select role</option>
            <option
              v-for="role in roles"
              :key="role.UserRoleID"
              :value="role.UserRoleID"
            >
              {{ role.UserRoleName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="accountStatus">Account Status</label>
          <select
            id="accountStatus"
            :value="modelValue.accountStatus"
            required
            @change="updateField('accountStatus', $event.target.value)"
          >
            <option value="Pending Verification">Pending Verification</option>
            <option value="Active">Active</option>
            <option value="Locked">Locked</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? loadingLabel : submitLabel }}
        </button>

        <button
          type="button"
          class="btn btn-secondary"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  roles: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: '',
  },
  submitLabel: {
    type: String,
    default: 'Save',
  },
  loadingLabel: {
    type: String,
    default: 'Saving...',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);
const showPassword = ref(false);

function updateField(field, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: field === 'roleId' && value !== '' ? Number(value) : value,
  });
}
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 24px;
}

.form-card {
  max-width: 760px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #111827;
}

input:focus,
select:focus {
  outline: none;
  border-color: #1f6feb;
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.12);
}

.text-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: #1f6feb;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
}

.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error-text {
  color: #b91c1c;
  font-weight: 600;
}
</style>