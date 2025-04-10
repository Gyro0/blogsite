/*
  useAuth.js
  ---------
  Ce composable gère l'authentification (inscription, connexion, déconnexion, etc.)
  en utilisant Firebase Authentication.
*/

import { ref } from 'vue';
import { auth } from '@/firebase/firebaseInit';

// Store current user in a reactive reference
const currentUser = ref(null);

// Listen for authentication state changes
auth.onAuthStateChanged((user) => {
  currentUser.value = user;
});

export function useAuth() {
  const error = ref(null);
  const isLoading = ref(false);

  // Register with email and password
  const register = async (email, password, displayName) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      if (res) {
        await res.user.updateProfile({ displayName });
        currentUser.value = res.user;
      }
      return res;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        error.value = "Cette adresse email est déjà utilisée.";
      } else if (err.code === 'auth/invalid-email') {
        error.value = "Adresse email invalide.";
      } else if (err.code === 'auth/weak-password') {
        error.value = "Le mot de passe est trop faible.";
      } else {
        error.value = err.message;
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Login
  const login = async (email, password) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      currentUser.value = res.user;
      return res;
    } catch (err) {
      error.value = "Erreur de connexion. Vérifiez vos identifiants.";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    await auth.signOut();
    currentUser.value = null;
    window.location.href = '/';
  };

  // Reset password
  const resetPassword = async (email) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (err) {
      error.value = "Erreur lors de la réinitialisation du mot de passe.";
    } finally {
      isLoading.value = false;
    }
  };

  // Force token refresh
  const forceTokenRefresh = async () => {
    if (currentUser.value) {
      await currentUser.value.getIdToken(true);
      return true;
    }
    return false;
  };

  return {
    currentUser,
    error,
    isLoading,
    register,
    login,
    logout,
    resetPassword,
    forceTokenRefresh
  };
}
