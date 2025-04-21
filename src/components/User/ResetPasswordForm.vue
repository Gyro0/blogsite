<template>
  <div class="reset-card">
    <div class="reset-header">
      <span class="reset-icon">
        <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="#a8daf9"/><rect x="4" y="15" width="16" height="6" rx="3" fill="#cde2ee"/></svg>
      </span>
      <h2>Réinitialiser mon mot de passe</h2>
      <p class="reset-subtitle">Un email contenant un lien de réinitialisation vous sera envoyé.</p>
    </div>
    <div v-if="passwordResetSuccess" class="blue-alert success-alert">
      Un email de réinitialisation de mot de passe a été envoyé à votre adresse email.
    </div>
    <form class="reset-form" @submit.prevent="sendResetEmail" v-if="!passwordResetSuccess">
      <div class="form-group">
        <label for="reset-email">Votre adresse email</label>
        <input
          id="reset-email"
          v-model="email"
          type="email"
          placeholder="Entrez votre email"
          required
          :disabled="isLoading"
        />
      </div>
      <button class="blue-btn reset-btn" type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Envoyer l'email de réinitialisation</span>
      </button>
    </form>
    <div v-if="error" class="blue-alert error-alert mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'ResetPasswordForm',
  setup() {
    const { resetPassword, error: authError, isLoading } = useAuth();
    const email = ref('');
    const error = ref(null);
    const passwordResetSuccess = ref(false);

    const sendResetEmail = async () => {
      error.value = null;
      if (!email.value) {
        error.value = "Veuillez saisir votre adresse email.";
        return;
      }
      await resetPassword(email.value);
      if (!authError.value) {
        passwordResetSuccess.value = true;
      } else {
        error.value = authError.value;
      }
    };

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

<style scoped>
.reset-card {
  max-width: 400px;
  margin: 3.5rem auto 0 auto;
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 22px;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 2.5rem 2rem 1.5rem 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reset-header {
  text-align: center;
  margin-bottom: 2rem;
}
.reset-icon {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.reset-header h2 {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -1px;
  color: #92d2f9;
  margin-bottom: 0.2rem;
  text-shadow: 0 2px 8px #a8daf955;
}
.reset-subtitle {
  color: #23405a;
  font-size: 1.05rem;
  opacity: 0.85;
}

.reset-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-group label {
  font-weight: 600;
  color: #23405a;
  margin-bottom: 0.1rem;
}
.form-group input {
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  box-shadow: 0 1px 4px #a8daf922;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.18s;
}
.form-group input:focus {
  border-color: #a8daf9;
}

.blue-btn.reset-btn {
  width: 100%;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a !important;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.7rem 2rem;
  box-shadow: 0 2px 8px #a8daf955;
  transition: background 0.2s, color 0.2s, transform 0.15s;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
  font-size: 1.1rem;
  position: relative;
}
.blue-btn.reset-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.blue-btn.reset-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a !important;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 24px #92d2f988;
}

.loader {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border: 2.5px solid #a8daf9;
  border-top: 2.5px solid #92d2f9;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.blue-alert {
  background: #e4edf2;
  color: #23405a;
  border: 1.5px solid #a8daf9;
  border-radius: 1rem;
  font-weight: 500;
  margin-top: 1.2rem;
  padding: 1rem 1.5rem;
  text-align: center;
}
.success-alert {
  border-color: #92d2f9;
  background: #cde2ee;
  color: #23405a;
}
.error-alert {
  border-color: #ffb3b3;
  background: #fff;
  color: #a94442;
}

.mt-3 {
  margin-top: 1.2rem;
}

@media (max-width: 600px) {
  .reset-card {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    border-radius: 1rem;
    margin-top: 1.5rem;
  }
  .reset-header h2 {
    font-size: 1.1rem;
  }
}
</style>
