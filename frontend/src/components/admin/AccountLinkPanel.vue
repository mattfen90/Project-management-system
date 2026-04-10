<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h3>Linked Account</h3>
        <p class="muted">
          Connect this {{ entityLabel.toLowerCase() }} record to an existing user account.
        </p>
      </div>
    </div>

    <div v-if="currentLinkedUser" class="linked-user">
      <div class="linked-user-info">
        <p><strong>Username:</strong> {{ currentLinkedUser.Username }}</p>
        <p><strong>Email:</strong> {{ currentLinkedUser.Email }}</p>
        <p><strong>Status:</strong> {{ currentLinkedUser.AccountStatus }}</p>
        <p><strong>Role:</strong> {{ currentLinkedUser.userrolestable?.UserRoleName || role }}</p>
      </div>

      <button
        class="btn btn-danger"
        :disabled="loading"
        @click="$emit('unlink')"
      >
        {{ loading ? 'Working...' : 'Unlink Account' }}
      </button>
    </div>

    <div v-else class="link-form">
      <div class="form-group">
        <label for="userId">Available {{ role }} Accounts</label>
        <select
          id="userId"
          :value="selectedUserId"
          :disabled="loading || loadingUsers"
          @change="$emit('update:selectedUserId', $event.target.value)"
        >
          <option value="">Select a user</option>
          <option
            v-for="user in users"
            :key="user.UserID"
            :value="user.UserID"
          >
            {{ user.Username }} — {{ user.Email }}
          </option>
        </select>
      </div>

      <div class="actions">
        <button
          class="btn btn-primary"
          :disabled="loading || loadingUsers || !selectedUserId"
          @click="$emit('link')"
        >
          {{ loading ? 'Linking...' : 'Link Account' }}
        </button>
      </div>
    </div>

    <p v-if="loadingUsers" class="muted">Loading available accounts...</p>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  role: {
    type: String,
    required: true,
  },
  entityLabel: {
    type: String,
    required: true,
  },
  currentLinkedUser: {
    type: Object,
    default: null,
  },
  users: {
    type: Array,
    default: () => [],
  },
  selectedUserId: {
    type: [String, Number],
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingUsers: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
});

defineEmits(['update:selectedUserId', 'link', 'unlink']);
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0 0 6px;
  color: #111827;
}

.muted {
  color: #6b7280;
  margin: 0;
}

.linked-user {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.linked-user-info p {
  margin: 0 0 8px;
}

.link-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #374151;
}

select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
}

.actions {
  display: flex;
  gap: 12px;
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

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error-text {
  color: #b91c1c;
  font-weight: 600;
  margin-top: 12px;
}
</style>