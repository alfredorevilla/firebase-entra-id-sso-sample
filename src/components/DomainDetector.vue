<template>
  <div v-if="suggestedProvider !== 'none'" class="domain-banner">
    <div class="banner-content">
      <span class="banner-icon">💼</span>
      <div class="banner-text">
        <p class="banner-title">{{ bannerTitle }}</p>
        <p class="banner-description">{{ bannerDescription }}</p>
      </div>
      <button @click="handleSuggestionClick" class="banner-button">
        {{ suggestedButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  detectProviderFromEmail,
  getProviderDisplayName,
  type SSOProvider,
} from '@/config/domainMap'

interface Props {
  email: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectProvider: [provider: SSOProvider]
}>()

const suggestedProvider = computed<SSOProvider>(() => {
  return detectProviderFromEmail(props.email)
})

const providerDisplayName = computed(() => {
  return getProviderDisplayName(suggestedProvider.value)
})

const bannerTitle = computed(() => {
  return `Welcome, ${props.email.split('@')[1]} user!`
})

const bannerDescription = computed(() => {
  return `We detected your organization uses ${providerDisplayName.value}. Use your corporate account to sign up.`
})

const suggestedButtonText = computed(() => {
  return `Sign up with ${providerDisplayName.value}`
})

const handleSuggestionClick = () => {
  if (suggestedProvider.value !== 'none') {
    emit('selectProvider', suggestedProvider.value)
  }
}
</script>

<style scoped>
.domain-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: white;
}

.banner-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
}

.banner-title {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
}

.banner-description {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.banner-button {
  padding: 0.5rem 1rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .banner-button {
    width: 100%;
  }
}
</style>
