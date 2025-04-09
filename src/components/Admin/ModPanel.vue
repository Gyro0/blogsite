<template>
    <b-card title="Panneau de Modération">
      <p>Ici, le modérateur peut gérer les utilisateurs, discuter, etc.</p>
      <b-button variant="info" @click="testModeratorAction">Action Modérateur</b-button>
    </b-card>
  </template>
  
  <script>
  import { useModerator } from '@/composables/useModerator';
  
  export default {
    name: 'ModPanel',
    setup() {
      const { isModerator, checkModerator } = useModerator();
      checkModerator();
  
      const testModeratorAction = () => {
        if (!isModerator.value) {
          alert("Vous n'êtes pas modérateur.");
          return;
        }
        alert("Action modérateur exécutée.");
      };
  
      return {
        isModerator,
        testModeratorAction
      };
    }
  };
  </script>
  