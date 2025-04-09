<template>
    <div class="container mt-4">
      <DiscussionForm />
    </div>
  </template>
  
  <script>
  import DiscussionForm from '@/components/Discussions/DiscussionForm.vue';
  
  export default {
    name: 'CreateDiscussionView',
    components: {
      DiscussionForm
    }
  };
  </script>
  