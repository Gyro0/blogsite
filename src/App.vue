<template>
  <div>
    <!-- Navbar (unchanged) -->
    <Navbar />

    <!-- Main content with container -->
    <div class="container mt-4">
      <router-view />
    </div>
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
body {
  background-color: #f8f9fa;
}

.discussion-card {
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.discussion-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
</style>
