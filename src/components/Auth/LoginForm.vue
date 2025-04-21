<template>
  <div class="login-card">
    <div class="login-header">
      <span class="login-icon">
        <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="#a8daf9"/><rect x="4" y="15" width="16" height="6" rx="3" fill="#cde2ee"/></svg>
      </span>
      <h2>Connexion</h2>
      <p class="login-subtitle">Connectez-vous à votre compte MyForum</p>
    </div>
    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          v-model="email"
          required
          autocomplete="username"
          placeholder="Votre email"
        />
      </div>
      <div class="form-group">
        <label for="login-password">Mot de passe</label>
        <input
          id="login-password"
          type="password"
          v-model="password"
          required
          autocomplete="current-password"
          placeholder="Votre mot de passe"
        />
      </div>
      <button class="blue-btn login-btn" type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Se connecter</span>
      </button>
      <div v-if="error" class="blue-alert error-alert">{{ error }}</div>
    </form>
    <div class="login-footer">
      <router-link to="/register">Créer un compte</router-link>
      <span class="dot">·</span>
      <router-link to="/reset-password">Mot de passe oublié ?</router-link>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import { useFirestore } from '@/composables/useFirestore';

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
    });

    const handleLogin = async () => {
      error.value = null;
      const res = await login(email.value, password.value);
      if (res && res.user) {
        await res.user.getIdToken(true);
        const { getItem, setItem } = useFirestore('users');
        const userDoc = await getItem(res.user.uid);
        if (!userDoc) {
          await setItem(res.user.uid, {
            displayName: res.user.displayName || email.value.split('@')[0],
            email: email.value.toLowerCase(),
            role: 'user',
            createdAt: new Date()
          });
        }
        router.push('/');
      } else {
        error.value = "Échec de connexion. Vérifiez vos identifiants.";
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

<style scoped>
.login-card {
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

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}
.login-icon {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.login-header h2 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
  color: #92d2f9;
  margin-bottom: 0.2rem;
  text-shadow: 0 2px 8px #a8daf955;
}
.login-subtitle {
  color: #23405a;
  font-size: 1.05rem;
  opacity: 0.85;
}

.login-form {
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

.blue-btn.login-btn {
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
.blue-btn.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.blue-btn.login-btn:hover:not(:disabled) {
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
.error-alert {
  border-color: #ffb3b3;
  background: #fff;
  color: #a94442;
}

.login-footer {
  margin-top: 1.7rem;
  text-align: center;
  color: #23405a;
  font-size: 1rem;
  opacity: 0.85;
}
.login-footer .dot {
  margin: 0 0.5rem;
  color: #bbdcf0;
}
.login-footer a {
  color: #92d2f9;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.18s;
}
.login-footer a:hover {
  color: #23405a;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .login-card {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    border-radius: 1rem;
    margin-top: 1.5rem;
  }
  .login-header h2 {
    font-size: 1.3rem;
  }
}
</style>
