<template>
    <div class="container mt-4">
      <UserProfile />
      <ResetPasswordForm class="mt-4"/>
    </div>
  </template>
  
  <script>
  import UserProfile from '@/components/User/UserProfile.vue';
  import ResetPasswordForm from '@/components/User/ResetPasswordForm.vue';
  
  export default {
    name: 'ProfileView',
    components: {
      UserProfile,
      ResetPasswordForm
    }
  };
  </script>
  