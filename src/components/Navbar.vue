<template>
  <nav class="navbar">
    <router-link class="navbar-brand" to="/">MyForum</router-link>
    <ul class="navbar-links">
      <li><router-link to="/" exact-active-class="active-link">Accueil</router-link></li>
      <li v-if="!user"><router-link class="connexion" to="/login">Connexion</router-link></li>
      <li v-if="!user"><router-link class="inscription" to="/register">Inscription</router-link></li>
      <li v-if="user"><router-link to="/profile">Profil</router-link></li>
      <li v-if="user"><router-link to="/create-discussion">Créer Discussion</router-link></li>
      <li v-if="isMod"><router-link to="/admin">Administration</router-link></li>
      <li v-if="user"><a @click.prevent="handleLogout" href="#">Déconnexion</a></li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useModerator } from '@/composables/useModerator';

const { currentUser, logout } = useAuth();
const { isModerator, checkModerator } = useModerator();

const user = computed(() => currentUser.value);
const isMod = computed(() => isModerator.value);

watch(currentUser, (newUser) => {
  if (newUser) checkModerator();
});
onMounted(() => {
  if (currentUser.value) checkModerator();
});
function handleLogout() {
  logout();
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(90deg, #e4edf2 70%, #a8daf9 100%);
  border-bottom: 2px solid #bbdcf0;
  box-shadow: 0 2px 12px #a8daf955;
  padding: 0.7rem 2.5rem;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  color: #23405a;
  font-weight: 800;
  font-size: 1.7rem;
  letter-spacing: 2px;
  text-shadow: 0 0 8px #bbdcf0, 0 2px 8px #cde2ee33;
  transition: color 0.2s, text-shadow 0.2s;
  text-decoration: none;
}
.navbar-brand:hover {
  color: #92d2f9;
  text-shadow: 0 0 16px #a8daf9, 0 2px 8px #cde2ee33;
}

.navbar-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
}
.navbar-links li {
  margin-left: 0.5rem;
}
.navbar-links a,
.navbar-links .router-link-active,
.navbar-links .active-link {
  color: #23405a;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.4rem 1.1rem;
  background: transparent;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  display: inline-block;
}
.navbar-links .connexion,
.navbar-links .inscription {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a !important;
  font-weight: 700;
  border-radius: 20px;
  padding: 0.4rem 1.4rem;
  margin-left: 1rem;
  box-shadow: 0 2px 8px #a8daf955;
  border: 1.5px solid #bbdcf0;
}
.navbar-links .connexion:hover,
.navbar-links .inscription:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a !important;
  box-shadow: 0 4px 16px #92d2f988;
}
.navbar-links a:not(.connexion):not(.inscription):hover,
.navbar-links .active-link:not(.connexion):not(.inscription) {
  color: #92d2f9;
  background: #e4edf2;
  box-shadow: 0 2px 12px #a8daf955;
}
.navbar-links a:last-child {
  margin-right: 0;
}

@media (max-width: 900px) {
  .navbar {
    padding: 0.5rem 1rem;
  }
  .navbar-brand {
    font-size: 1.2rem;
  }
  .navbar-links a {
    font-size: 1rem;
    padding: 0.3rem 0.7rem;
  }
}
</style>
