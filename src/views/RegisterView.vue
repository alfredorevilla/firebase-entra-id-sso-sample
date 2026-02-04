<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Create Account</h1>

      <DomainDetector
        v-if="email"
        :email="email"
        @selectProvider="handleProviderSelection"
      />

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            @input="onEmailChange"
          />
        </div>
        <div v-if="!useSSO" class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <button v-if="!useSSO" type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Register' }}
        </button>
        <button v-else type="button" class="btn-microsoft" @click="handleMicrosoftSignup" :disabled="isLoading">
          {{ isLoading ? 'Signing up...' : 'Sign up with Microsoft' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="register-links">
        <RouterLink to="/login">Already have an account? Login</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { RouterLink } from 'vue-router'
import DomainDetector from '@/components/DomainDetector.vue'
import { detectProviderFromEmail, type SSOProvider } from '@/config/domainMap'

const router = useRouter()
const { register, loginWithMicrosoft } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const useSSO = ref(false)

const onEmailChange = () => {
  // Reset SSO selection when email changes
  useSSO.value = false
}

const handleProviderSelection = (provider: SSOProvider) => {
  if (provider === 'microsoft.com') {
    useSSO.value = true
  }
}

const handleRegister = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const result = await register(email.value, password.value)
    if (result.error) {
      error.value = result.error
    } else {
      await router.push('/home')
    }
  } finally {
    isLoading.value = false
  }
}

const handleMicrosoftSignup = async () => {
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.register-card {
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

.btn-primary:disabled,
.btn-microsoft:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.register-links {
  text-align: center;
  margin-top: 1.5rem;
}

.register-links a {
  color: #1976d2;
  text-decoration: none;
}

.register-links a:hover {
  text-decoration: underline;
}
</style>
