<template>
  <div class="link-container">
    <div class="link-card">
      <h1>Link Your Account</h1>
      <p class="subtitle">
        An account already exists with the email <strong>{{ pendingEmail }}</strong>.
        Please enter your existing password to link accounts.
      </p>

      <form @submit.prevent="handleLinkAccount">
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            autofocus
          />
        </div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Linking account...' : 'Link Accounts' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { loginWithMicrosoft } = useAuth()

const password = ref('')
const error = ref('')
const isLoading = ref(false)
const pendingEmail = ref('')

onMounted(() => {
  // Get the email from route params or previous auth attempt
  const routeEmail = router.currentRoute.value.query.email as string
  if (routeEmail) {
    pendingEmail.value = routeEmail
  }
})

const handleLinkAccount = async () => {
  error.value = ''
  isLoading.value = true

  try {
    // In a full implementation, we would:
    // 1. Sign in with email and password
    // 2. Get the pending OAuth credential from sessionStorage
    // 3. Call linkWithCredential()
    // 4. Redirect to home

    // For now, show a message indicating next steps
    error.value = 'Account linking requires Firebase configuration. Please contact support.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.link-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.link-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 1rem;
  text-align: center;
}

.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #1976d2;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}
</style>
