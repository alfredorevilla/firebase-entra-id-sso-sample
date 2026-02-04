<template>
  <div class="status-container">
    <div class="status-card">
      <h1>Firebase Status</h1>
      <div class="status-grid">
        <div class="status-item">
          <label>Authentication Status:</label>
          <span :class="statusClass">{{ auth.state }}</span>
        </div>
        <div class="status-item">
          <label>Current User:</label>
          <span>{{ currentUser }}</span>
        </div>
        <div class="status-item">
          <label>User Roles:</label>
          <span>{{ userRoles }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { AuthState } from '@/types/auth'

const { auth } = useAuth()

const statusClass = computed(() => {
  if (auth.state.value === AuthState.AUTHED) {
    return 'status-authed'
  } else if (auth.state.value === AuthState.LOADING) {
    return 'status-loading'
  }
  return 'status-unauthed'
})

const currentUser = computed(() => {
  const user = auth.user.value
  return user?.email || user?.uid || 'Not logged in'
})

const userRoles = computed(() => {
  return auth.userProfile.value?.roles?.join(', ') || 'N/A'
})
</script>

<style scoped>
.status-container {
  padding: 2rem;
}

.status-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
}

.status-grid {
  display: grid;
  gap: 1.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  align-items: center;
}

label {
  font-weight: 600;
}

span {
  font-family: monospace;
}

.status-authed {
  background: #c8e6c9;
  color: #2e7d32;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-unauthed {
  background: #ffcdd2;
  color: #c62828;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-loading {
  background: #fff9c4;
  color: #f57f17;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
</style>
