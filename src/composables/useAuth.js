/*
  useAuth.js
  ---------
  Ce composable gère l'authentification (inscription, connexion, déconnexion, etc.)
  en utilisant Firebase Authentication.
*/

import { ref } from 'vue';
import { auth } from '@/firebase/firebaseInit';

// On stocke l'utilisateur courant dans une référence réactive
const currentUser = ref(null);

// On écoute les changements d'état (authentification)
auth.onAuthStateChanged((user) => {
  currentUser.value = user;
});

export function useAuth() {
  const error = ref(null);
  const isLoading = ref(false);

  // Inscription avec email et mot de passe
  const register = async (email, password, displayName) => {
    error.value = null;
    isLoading.value = true;
    try {
      console.log("Attempting to register:", email);
      const res = await auth.createUserWithEmailAndPassword(email, password);
      if (res) {
        // Mettre à jour le profil pour stocker le displayName
        await res.user.updateProfile({ displayName });
        currentUser.value = res.user;
      }
      return res;
    } catch (err) {
      console.error("Registration error:", err.code, err.message);
      
      // Provide user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        error.value = "Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse email.";
      } else if (err.code === 'auth/invalid-email') {
        error.value = "Adresse email invalide.";
      } else if (err.code === 'auth/weak-password') {
        error.value = "Le mot de passe est trop faible. Utilisez au moins 6 caractères.";
      } else {
        error.value = err.message;
      }
      
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Connexion
  const login = async (email, password) => {
    error.value = null;
    isLoading.value = true;
    try {
      console.log("Login attempt with:", email);
      const res = await auth.signInWithEmailAndPassword(email, password);
      console.log("Login successful:", res.user.uid);
      currentUser.value = res.user;
      return res;
    } catch (err) {
      console.error("Firebase auth error:", err.code, err.message);
      error.value = err.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Déconnexion
  const logout = async () => {
    error.value = null;
    try {
      await auth.signOut();
      currentUser.value = null;
      window.location.href = '/';
    } catch (err) {
      error.value = err.message;
    }
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email) => {
    error.value = null;
    isLoading.value = true;
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    currentUser,
    error,
    isLoading,
    register,
    login,
    logout,
    resetPassword
  };
}
