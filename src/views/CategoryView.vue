<template>
    <div class="container mt-4">
      <h2>Catégorie : {{ category }}</h2>
      <DiscussionList :discussions="discussions" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useFirestore } from '@/composables/useFirestore';
  import DiscussionList from '@/components/Discussions/DiscussionList.vue';
  
  export default {
    name: 'CategoryView',
    components: { DiscussionList },
    setup(_, { route }) {
      const { getAllItems } = useFirestore('discussions');
      const category = route.params.cat || 'All';
      const discussions = ref([]);
  
      const loadDiscussions = async () => {
        if (category === 'All') {
          discussions.value = await getAllItems({}, true);
        } else {
          discussions.value = await getAllItems({ field: 'category', value: category }, true);
        }
      };
  
      onMounted(() => {
        loadDiscussions();
      });
  
      return {
        category,
        discussions
      };
    }
  };
  </script>

  <style scoped>
.container {
  max-width: 900px;
  margin: 3rem auto 0 auto;
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 18px;
  box-shadow: 0 2px 16px #a8daf955;
  padding: 2.5rem 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
}

h2 {
  color: #23405a;
  font-weight: 800;
  letter-spacing: -1px;
  text-shadow: 0 2px 8px #a8daf955;
  margin-bottom: 2rem;
}

@media (max-width: 600px) {
  .container {
    padding: 1.2rem 0.5rem;
    margin-top: 1.5rem;
  }
}
</style>
