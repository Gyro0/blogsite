<template>
    <div class="container mt-4">
      <ModPanel />
      <ReportList class="mt-4" />
    </div>
  </template>
  
  <script>
  import ModPanel from '@/components/Admin/ModPanel.vue';
  import ReportList from '@/components/Admin/ReportList.vue';
  
  export default {
    name: 'AdminView',
    components: {
      ModPanel,
      ReportList
    }
  };
  </script>

  <style scoped>
  .container {
    max-width: 700px;
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
