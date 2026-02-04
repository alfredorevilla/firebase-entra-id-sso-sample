<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="divider">OR</div>

      <button @click="handleMicrosoftLogin" class="btn-microsoft" :disabled="isLoading">
        <span>Login with Microsoft</span>
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="login-links">
        <RouterLink to="/register">Don't have an account? Register</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { RouterLink } from 'vue-router'

const router = useRouter()
const { login, loginWithMicrosoft } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const result = await login(email.value, password.value)
    if (result.error) {
      error.value = result.error
    } else {
      await router.push('/home')
    }
  } finally {
    isLoading.value = false
  }
}

const handleMicrosoftLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const result = await loginWithMicrosoft()
    if (result.error) {
      error.value = result.error
    } else {
      await router.push('/home')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 1.5rem;
  text-align: center;
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

.btn-primary,
.btn-microsoft {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary {
  background: #1976d2;
  color: white;
  margin-bottom: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
}

.btn-microsoft {
  background: #0078d4;
  color: white;
}

.btn-microsoft:hover:not(:disabled) {
  background: #106ebe;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  color: #999;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.login-links {
  text-align: center;
  margin-top: 1.5rem;
}

.login-links a {
  color: #1976d2;
  text-decoration: none;
}

.login-links a:hover {
  text-decoration: underline;
}
</style>
