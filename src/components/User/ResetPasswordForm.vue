<template>
    <b-card title="Réinitialiser le mot de passe">
      <b-form @submit.prevent="submitReset">
        <b-form-group label="Email" label-for="resetEmail">
          <b-form-input
            id="resetEmail"
            type="email"
            v-model="email"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-button type="submit" variant="primary" :disabled="isLoading">Envoyer le lien de réinitialisation</b-button>
      </b-form>
  
      <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
      <b-alert v-if="success" variant="success" show>{{ success }}</b-alert>
    </b-card>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  
  export default {
    name: 'ResetPasswordForm',
    setup() {
      const email = ref('');
      const success = ref('');
      const { resetPassword, error, isLoading } = useAuth();
  
      const submitReset = async () => {
        await resetPassword(email.value);
        if (!error.value) {
          success.value = 'Un email de réinitialisation a été envoyé.';
        }
      };
  
      return {
        email,
        success,
        error,
        isLoading,
        submitReset
      };
    }
  };
  </script>
  