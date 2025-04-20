<template>
  <b-card title="Connexion">
    <b-form @submit.prevent="handleLogin">
      <b-form-group label="Email" label-for="login-email">
        <b-form-input
          id="login-email"
          type="email"
          v-model="email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Mot de passe" label-for="login-password">
        <b-form-input
          id="login-password"
          type="password"
          v-model="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="isLoading">Se connecter</b-button>
    </b-form>

    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
  </b-card>
</template>

<script>
import { ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import { useFirestore } from '@/composables/useFirestore';

export default {
  name: 'LoginForm',
  setup() {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Form data
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    
    // Router for navigation after login
    const router = useRouter();
    
    // Get authentication utilities
    const { login, error: authError, isLoading } = useAuth();
    
    // --------------------------------------------------------------
    // Side Effects
    // --------------------------------------------------------------
    
    // Watch for authentication errors and update local error state
    watch(authError, (newVal) => {
      error.value = newVal;
    });
    
    // --------------------------------------------------------------
    // Form Submission
    // --------------------------------------------------------------
    
    // Handle login form submission
    const handleLogin = async () => {
      // Clear any previous errors
      error.value = null;
      
      // Attempt to log in with provided credentials
      const res = await login(email.value, password.value);
      
      if (res && res.user) {
        // Force token refresh to ensure up-to-date permissions
        await res.user.getIdToken(true);
        
        // Check if user document exists in Firestore
        const { getItem, setItem } = useFirestore('users');
        const userDoc = await getItem(res.user.uid);
        
        // Create user document if it doesn't exist
        if (!userDoc) {
          await setItem(res.user.uid, {
            displayName: res.user.displayName || email.value.split('@')[0],
            email: email.value.toLowerCase(),
            role: 'user',
            createdAt: new Date()
          });
        }
        
        // Redirect to home page after successful login
        router.push('/');
      } else {
        // Handle failed login
        error.value = "Échec de connexion. Vérifiez vos identifiants.";
      }
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      email,
      password,
      error,
      isLoading,
      handleLogin
    };
  }
};
</script>
