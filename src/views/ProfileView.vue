<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>User Profile</h1>
      <div v-if="auth.user" class="profile-info">
        <div class="info-row">
          <label>Email:</label>
          <span>{{ userEmail }}</span>
        </div>
        <div class="info-row">
          <label>Display Name:</label>
          <span>{{ userDisplayName }}</span>
        </div>
        <div class="info-row">
          <label>User ID:</label>
          <span class="monospace">{{ userUid }}</span>
        </div>
        <div v-if="auth.userProfile" class="info-row">
          <label>Roles:</label>
          <span>{{ userRoles }}</span>
        </div>
        <div v-if="auth.userProfile" class="info-row">
          <label>Provider:</label>
          <span>{{ userProvider }}</span>
        </div>
      </div>
      <div v-else class="loading">Loading profile...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { auth } = useAuth()

const userEmail = computed(() => {
  const user = auth.user.value
  return user?.email || user?.uid
})

const userDisplayName = computed(() => {
  const user = auth.user.value
  return user?.displayName || 'Not set'
})

const userUid = computed(() => {
  const user = auth.user.value
  return user?.uid
})

const userRoles = computed(() => {
  return auth.userProfile.value?.roles?.join(', ') || 'N/A'
})

const userProvider = computed(() => {
  return auth.userProfile.value?.provider || 'N/A'
})
</script>

<style scoped>
.profile-container {
  padding: 2rem;
}

.profile-card {
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

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

label {
  font-weight: 600;
  min-width: 150px;
}

.monospace {
  font-family: monospace;
  word-break: break-all;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
