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
  
  export default {
    name: 'LoginForm',
    setup() {
      const email = ref('');
      const password = ref('');
      const error = ref(null);
      const router = useRouter();
  
      const { login, error: authError, isLoading } = useAuth();
  
      watch(authError, (newVal) => {
        error.value = newVal;
        console.log("Auth error updated:", newVal);
      });
  
      const handleLogin = async () => {
        try {
          error.value = null;
          console.log("Attempting login with:", email.value);
          const res = await login(email.value, password.value);
          
          if (res && res.user) {
            console.log("Login successful, navigating to home");
            router.push('/');
          } else {
            console.error("Login failed but no error was thrown");
            error.value = "Échec de connexion. Vérifiez vos identifiants.";
          }
        } catch (err) {
          console.error("Login error details:", err);
          error.value = err.message || "Une erreur s'est produite lors de la connexion.";
        }
      };
      
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
