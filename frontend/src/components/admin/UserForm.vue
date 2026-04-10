<template>
  <div class="card form-card">
    <form @submit.prevent="$emit('submit')">
      <div class="form-grid">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            :value="localForm.username"
            type="text"
            required
            @input="updateField('username', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            :value="localForm.email"
            type="email"
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
            :value="localForm.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="isEdit ? 'Leave blank to keep current password' : ''"
            :required="!isEdit"
            @input="updateField('password', $event.target.value)"
          />
          <button type="button" class="text-btn" @click="showPassword = !showPassword">
            {{ showPassword ? 'Hide' : 'Show' }} password
          </button>
        </div>

        <div class="form-group">
          <label for="roleId">Role</label>
          <select
            id="roleId"
            :value="localForm.roleId"
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
            :value="localForm.accountStatus"
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

      <p v-if="error" class="error">{{ error }}</p>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? loadingLabel : submitLabel }}
        </button>

        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

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

const localForm = computed(() => props.modelValue);

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
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 24px;
}

.form-card {
  max-width: 760px;
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

input,
select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  display: inline-block;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background: #1f6feb;
  color: white;
}

.btn-secondary {
  background: #eaeaea;
  color: #222;
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

.error {
  margin-top: 16px;
  color: #b42318;
  font-weight: 600;
}
</style>