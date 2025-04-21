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

  <style scoped>
.container {
  max-width: 600px;
  margin: 3rem auto 0 auto;
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 18px;
  box-shadow: 0 2px 16px #a8daf955;
  padding: 2.5rem 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
}

@media (max-width: 600px) {
  .container {
    padding: 1.2rem 0.5rem;
    margin-top: 1.5rem;
  }
}
</style>
