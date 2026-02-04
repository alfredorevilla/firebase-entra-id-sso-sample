<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">Firebase SSO Sample</div>
      <div v-if="auth.user" class="nav-user">
        <span>{{ userEmail }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { RouterView } from 'vue-router'

const { auth, logout } = useAuth()

const userEmail = computed(() => {
  const user = auth.user.value
  return user?.email || user?.uid || ''
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-user {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #d32f2f;
}
</style>
