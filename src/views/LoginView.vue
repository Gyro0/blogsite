<template>
    <div class="container mt-4">
      <LoginForm />
    </div>
  </template>
  
  <script>
  import LoginForm from '@/components/Auth/LoginForm.vue';
  
  export default {
    name: 'LoginView',
    components: {
      LoginForm
    }
  };
  </script>
  