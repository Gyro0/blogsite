<template>
    <div class="container mt-4">
      <RegisterForm />
    </div>
  </template>
  
  <script>
  import RegisterForm from '@/components/Auth/RegisterForm.vue';
  
  export default {
    name: 'RegisterView',
    components: {
      RegisterForm
    }
  };
  </script>
  