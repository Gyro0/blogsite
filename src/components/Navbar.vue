<template>
  <b-navbar variant="light" type="light">
    <b-navbar-brand to="/">MyForum</b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-item to="/" exact>Accueil</b-nav-item>
      <b-nav-item v-if="!user" to="/login">Connexion</b-nav-item>
      <b-nav-item v-if="!user" to="/register">Inscription</b-nav-item>
      <b-nav-item v-if="user" to="/profile">Profil</b-nav-item>
      <b-nav-item v-if="user" to="/create-discussion">Créer Discussion</b-nav-item>
      <b-nav-item v-if="isMod" to="/admin">Administration</b-nav-item>
      <b-nav-item v-if="user" @click="handleLogout">Déconnexion</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useModerator } from '@/composables/useModerator';

export default {
  name: 'Navbar',
  setup() {
    const { currentUser, logout } = useAuth();
    const { isModerator, checkModerator } = useModerator();

    const user = computed(() => currentUser.value);
    const isMod = computed(() => isModerator.value);

    // Check moderator status whenever currentUser changes
    watch(currentUser, (newUser) => {
      if (newUser) {
        console.log("Current user changed, checking mod status");
        checkModerator();
      }
    });

    // On mount, check if the user is logged in and then check mod status
    onMounted(() => {
      if (currentUser.value) {
        console.log("Component mounted, checking mod status");
        checkModerator();
      }
    });

    const handleLogout = () => {
      logout();
    };

    return {
      user,
      isMod,
      handleLogout
    };
  }
};
</script>
