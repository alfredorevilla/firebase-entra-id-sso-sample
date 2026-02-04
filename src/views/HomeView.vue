<template>
  <div class="home-container">
    <div class="content">
      <h1>Welcome, {{ userDisplay }}!</h1>
      <p>You are now logged in.</p>
      <nav class="quick-links">
        <RouterLink to="/profile" class="link">View Profile</RouterLink>
        <RouterLink to="/status" class="link">Status</RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { RouterLink } from 'vue-router'

const { auth } = useAuth()

const userDisplay = computed(() => {
  const user = auth.user.value
  return user?.email || user?.uid || 'Guest'
})
</script>

<style scoped>
.home-container {
  padding: 2rem;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1rem;
}

.quick-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.link {
  padding: 0.75rem 1.5rem;
  background: #1976d2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  display: inline-block;
  transition: background 0.3s;
}

.link:hover {
  background: #1565c0;
}
</style>
