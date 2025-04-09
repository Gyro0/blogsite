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
  
      <!-- Add the login link -->
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
      const displayName = ref('');
      const email = ref('');
      const password = ref('');
      const error = ref(null);
      const router = useRouter();
  
      const { register, error: authError, isLoading } = useAuth();
      const { addItem, getAllItems } = useFirestore('users');
  
      // Watch for auth errors and update our local error
      watch(authError, (newValue) => {
        if (newValue) {
          error.value = newValue;
        }
      });
  
      const handleRegister = async () => {
        try {
          error.value = null;
  
          // Client-side validation
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
  
          // Check if email already exists in Firestore
          console.log("Checking if email exists:", email.value);  // DEBUGGING
          const existingUsers = await getAllItems({
            field: 'email',
            value: email.value.toLowerCase().trim()
          });
  
          console.log("Existing Users:", existingUsers);  // DEBUGGING
  
          if (existingUsers && existingUsers.length > 0) {
            error.value = "Cette adresse email est déjà utilisée";
            return;
          }
  
          console.log("Starting registration for:", email.value);
          const res = await register(email.value, password.value, displayName.value);
  
          if (res && res.user) {
            console.log("User registered with Auth:", res.user.uid);
  
            // Create user document in Firestore
            try {
              const userData = {
                uid: res.user.uid,
                displayName: displayName.value,
                email: email.value.toLowerCase(),
                role: 'user', // Default role
                createdAt: new Date()
              };
  
              console.log("Adding user data to Firestore:", userData);  // DEBUGGING
  
              await addItem(userData);  // Pass the userData object directly
  
              console.log("User document created in Firestore");
  
              // Redirect to home page or dashboard
              router.push('/');
            } catch (firestoreError) {
              console.error("Error creating user document:", firestoreError);
              error.value = "Compte créé, mais erreur lors de la sauvegarde du profil.";
            }
          }
        } catch (err) {
          console.error("Registration error:", err);
  
          // Handle specific Firebase Auth errors
          if (err.code === 'auth/email-already-in-use') {
            error.value = "Cette adresse email est déjà utilisée";
          } else if (err.code === 'auth/invalid-email') {
            error.value = "Format d'email invalide";
          } else if (err.code === 'auth/weak-password') {
            error.value = "Mot de passe trop faible (minimum 6 caractères)";
          } else {
            error.value = err.message || "Erreur lors de l'inscription";
          }
  
          // Clear password for security
          password.value = '';
        }
      };
  
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
  