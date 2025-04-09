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
  import { updateProfile } from 'firebase/empty-import';
  
  export default {
    name: 'UserProfile',
    setup() {
      const { currentUser } = useAuth();
  
      const displayName = ref(currentUser.value?.displayName || '');
      const email = ref(currentUser.value?.email || '');
      const editDisplayName = ref(displayName.value);
  
      const updateProfile = async () => {
        if (!currentUser.value) return;
        await updateProfile(currentUser.value, {
          displayName: editDisplayName.value
        });
        displayName.value = editDisplayName.value;
        alert('Profil mis à jour !');
      };
  
      return {
        displayName,
        editDisplayName,
        email,
        updateProfile
      };
    }
  };
  </script>
  