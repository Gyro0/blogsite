<template>
  <b-card title="Inscription">
    <b-form @submit.prevent="handleRegister">
      <b-form-group label="Nom d'utilisateur" label-for="reg-displayName">
        <b-form-input id="reg-displayName" v-model="displayName" required></b-form-input>
      </b-form-group>

      <b-form-group label="Email" label-for="reg-email">
        <b-form-input id="reg-email" type="email" v-model="email" required></b-form-input>
      </b-form-group>

      <b-form-group label="Mot de passe" label-for="reg-password">
        <b-form-input id="reg-password" type="password" v-model="password" required></b-form-input>
        <small class="text-muted">Le mot de passe doit contenir au moins 6 caractères.</small>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="isLoading">
        <b-spinner small v-if="isLoading" class="mr-1"></b-spinner>
        S'inscrire
      </b-button>
    </b-form>

    <p v-if="error" class="text-danger mt-3 p-2 bg-danger bg-opacity-10 rounded">{{ error }}</p>

    <p class="mt-3 text-center">
      Vous avez déjà un compte ? <router-link to="/login">Connectez-vous ici</router-link>
    </p>
  </b-card>
</template>

<script>
import { ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFirestore } from '@/composables/useFirestore';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterForm',
  setup() {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Form data
    const displayName = ref('');
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    
    // Router for navigation after registration
    const router = useRouter();
    
    // Get authentication and Firestore utilities
    const { register, error: authError, isLoading } = useAuth();
    const { getAllItems, setItem } = useFirestore('users');
    
    // --------------------------------------------------------------
    // Side Effects
    // --------------------------------------------------------------
    
    // Watch for authentication errors and update local error state
    watch(authError, (newValue) => {
      if (newValue) error.value = newValue;
    });
    
    // --------------------------------------------------------------
    // Form Submission
    // --------------------------------------------------------------
    
    // Handle registration form submission
    const handleRegister = async () => {
      // Clear any previous errors
      error.value = null;

      // Basic validation
      if (!displayName.value.trim()) {
        error.value = "Le nom d'utilisateur est requis";
        return;
      }

      if (!email.value.trim()) {
        error.value = "L'email est requis";
        return;
      }

      if (password.value.length < 6) {
        error.value = "Le mot de passe doit contenir au moins 6 caractères";
        return;
      }

      // Check if email exists
      const existingUsers = await getAllItems({
        field: 'email',
        value: email.value.toLowerCase().trim()
      });

      if (existingUsers && existingUsers.length > 0) {
        error.value = "Cette adresse email est déjà utilisée";
        return;
      }

      // Register user
      const res = await register(email.value, password.value, displayName.value);

      if (res && res.user) {
        // Create user document
        const userData = {
          displayName: displayName.value,
          email: email.value.toLowerCase(),
          role: 'user',
          createdAt: new Date()
        };
        
        // Save user data to Firestore
        await setItem(res.user.uid, userData);
        
        // Redirect to home page
        router.push('/');
      } else {
        error.value = "Erreur lors de l'inscription";
      }
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      displayName,
      email,
      password,
      error,
      isLoading,
      handleRegister
    };
  }
};
</script>
