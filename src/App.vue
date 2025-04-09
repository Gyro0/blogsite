<template>
  <div>
    <!-- Composant Navbar (toujours affiché) -->
    <Navbar />

    <!-- Zone d'affichage des Vues en fonction de la route -->
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
/* Styles globaux ou mise en page principale */
</style>
