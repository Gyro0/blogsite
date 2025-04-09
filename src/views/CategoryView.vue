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
  