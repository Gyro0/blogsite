<template>
  <b-card title="Mon Profil">
    <p><strong>Nom :</strong> {{ displayName }}</p>
    <p><strong>Email :</strong> {{ email }}</p>

    <b-form-group label="Nom d'utilisateur" label-for="displayName">
      <b-form-input id="displayName" v-model="editDisplayName" />
    </b-form-group>
    <b-button variant="primary" @click="updateProfile">Enregistrer</b-button>
  </b-card>
</template>

<script>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'UserProfile',
  setup() {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Get current user
    const { currentUser } = useAuth();

    // Profile data
    const displayName = ref(currentUser.value?.displayName || '');
    const email = ref(currentUser.value?.email || '');
    const editDisplayName = ref(displayName.value);
    
    // --------------------------------------------------------------
    // User Actions
    // --------------------------------------------------------------

    // Update profile with new display name
    const updateProfile = async () => {
      if (!currentUser.value) return;
      
      // Firebase v8 syntax for updating user profile
      try {
        await currentUser.value.updateProfile({
          displayName: editDisplayName.value
        });
        
        // Update local state after successful profile update
        displayName.value = editDisplayName.value;
        alert('Profil mis à jour !');
      } catch (error) {
        console.error("Error updating profile:", error);
        alert('Erreur lors de la mise à jour du profil.');
      }
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      displayName,
      editDisplayName,
      email,
      updateProfile
    };
  }
};
</script>