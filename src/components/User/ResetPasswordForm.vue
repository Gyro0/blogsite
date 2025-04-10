<template>
  <b-card title="Réinitialiser mon mot de passe">
    <div v-if="passwordResetSuccess" class="alert alert-success">
      Un email de réinitialisation de mot de passe a été envoyé à votre adresse email.
    </div>
    
    <b-form @submit.prevent="sendResetEmail" v-if="!passwordResetSuccess">
      <b-form-group 
        label="Votre adresse email" 
        label-for="reset-email"
        description="Un email contenant un lien de réinitialisation vous sera envoyé."
      >
        <b-form-input
          id="reset-email"
          v-model="email"
          type="email"
          placeholder="Entrez votre email"
          required
          :disabled="isLoading"
        ></b-form-input>
      </b-form-group>
      
      <b-button type="submit" variant="primary" :disabled="isLoading">
        <b-spinner small v-if="isLoading" class="mr-1"></b-spinner>
        Envoyer l'email de réinitialisation
      </b-button>
    </b-form>
    
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </b-card>
</template>

<script>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'ResetPasswordForm',
  setup() {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Get authentication utilities
    const { resetPassword, error: authError, isLoading } = useAuth();
    
    // Form data
    const email = ref('');
    const error = ref(null);
    
    // Track password reset status
    const passwordResetSuccess = ref(false);
    
    // --------------------------------------------------------------
    // Form Submission
    // --------------------------------------------------------------

    // Send password reset email
    const sendResetEmail = async () => {
      // Clear previous errors
      error.value = null;
      
      // Validate email
      if (!email.value) {
        error.value = "Veuillez saisir votre adresse email.";
        return;
      }
      
      // Send reset email via Firebase
      await resetPassword(email.value);
      
      // Handle result
      if (!authError.value) {
        // Show success message
        passwordResetSuccess.value = true;
      } else {
        // Show error message
        error.value = authError.value;
      }
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      email,
      error,
      isLoading,
      passwordResetSuccess,
      sendResetEmail
    };
  }
};
</script>
