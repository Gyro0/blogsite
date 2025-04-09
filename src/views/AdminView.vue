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
  