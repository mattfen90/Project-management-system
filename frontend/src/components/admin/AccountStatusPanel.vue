<template>
  <div class="status-panel card">
    <h3 class="panel-title">Account Status</h3>

    <div class="current-status">
      <span class="label">Current Status:</span>
      <span class="badge" :class="badgeClass(props.user.AccountStatus)">{{ props.user.AccountStatus }}</span>
      <span v-if="props.user.LockedUntil && isLocked" class="lock-info">
        Locked until {{ formatDate(props.user.LockedUntil) }}
      </span>
    </div>

    <div class="actions">
      <!-- Unlock shortcut -->
      <button
        v-if="isLocked"
        class="btn btn-warning"
        :disabled="loading"
        @click="handleUnlock"
      >
        {{ loading ? 'Unlocking...' : 'Unlock Account' }}
      </button>

      <!-- Status selector for non-locked changes -->
      <div v-else class="status-change">
        <div class="form-group">
          <label for="newStatus">Change Status</label>
          <select id="newStatus" v-model="selectedStatus">
            <option value="Active">Active</option>
            <option value="Locked">Locked</option>
            <option value="Disabled">Disabled</option>
            <option value="Pending Verification">Pending Verification</option>
          </select>
        </div>

        <div v-if="selectedStatus === 'Locked'" class="form-group">
          <label for="lockedUntil">Lock Until (optional — defaults to 24h)</label>
          <input id="lockedUntil" v-model="lockedUntil" type="datetime-local" />
        </div>

        <button
          class="btn btn-primary"
          :disabled="loading || selectedStatus === props.user.AccountStatus"
          @click="handleStatusChange"
        >
          {{ loading ? 'Saving...' : 'Apply Status' }}
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminUsersStore } from '../../stores/adminUsers';

const props = defineProps({
  user: { type: Object, required: true },
});

const emit = defineEmits(['updated']);

const store = useAdminUsersStore();
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const selectedStatus = ref(props.user.AccountStatus);
const lockedUntil = ref('');

const isLocked = computed(() => {
  if (props.user.AccountStatus !== 'Locked') return false;
  if (!props.user.LockedUntil) return true;
  return new Date() < new Date(props.user.LockedUntil);
});

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString();
}

function badgeClass(status) {
  switch (status) {
    case 'Active': return 'badge-success';
    case 'Locked': return 'badge-warning';
    case 'Disabled': return 'badge-danger';
    default: return 'badge-muted';
  }
}

async function handleStatusChange() {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;
  try {
    const updated = await store.updateAccountStatus(
      props.user.UserID,
      selectedStatus.value,
      lockedUntil.value || null
    );
    successMessage.value = `Status updated to ${updated.AccountStatus}`;
    emit('updated', updated);
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Failed to update status';
  } finally {
    loading.value = false;
  }
}

async function handleUnlock() {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;
  try {
    const updated = await store.unlockAccount(props.user.UserID);
    successMessage.value = 'Account unlocked successfully';
    emit('updated', updated);
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Failed to unlock account';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.status-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  margin-top: 24px;
}
.panel-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}
.current-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.label {
  font-weight: 600;
  color: #374151;
}
.lock-info {
  font-size: 13px;
  color: #b54708;
}
.status-change {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 400px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}
select, input[type="datetime-local"] {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #111827;
}
.actions {
  margin-top: 8px;
}
.btn {
  display: inline-block;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn-primary  { background: #1f6feb; color: #fff; }
.btn-warning  { background: #f59e0b; color: #fff; }
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.badge-success { background: #d1fadf; color: #067647; }
.badge-warning { background: #fef0c7; color: #b54708; }
.badge-danger  { background: #fee4e2; color: #b42318; }
.badge-muted   { background: #f2f4f7; color: #475467; }
.error   { margin-top: 12px; color: #b91c1c; font-weight: 600; }
.success { margin-top: 12px; color: #067647; font-weight: 600; }
</style>
