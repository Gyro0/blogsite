<template>
    <div class="container mt-4">
      <DiscussionDetail v-if="discussion" :discussion="discussion" />
      <!-- Liste des réponses -->
      <ResponseList 
        :responses="responses" 
        @response-deleted="loadResponses"
      />
  
      <!-- Formulaire de réponse (uniquement si connecté) -->
      <ResponseForm 
        v-if="isLoggedIn" 
        :discussionId="discussionId" 
        @response-added="loadResponses"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router'; // Add this import
  import { useAuth } from '@/composables/useAuth';
  import { useFirestore } from '@/composables/useFirestore';
  
  import DiscussionDetail from '@/components/Discussions/DiscussionDetail.vue';
  import ResponseList from '@/components/Discussions/ResponseList.vue';
  import ResponseForm from '@/components/Discussions/ResponseForm.vue';
  
  export default {
    name: 'DiscussionView',
    components: {
      DiscussionDetail,
      ResponseList,
      ResponseForm
    },
    setup() { // Remove the route parameter from here
      const route = useRoute(); // Add this line to get the route
      const { currentUser } = useAuth();
      const { getItem: getDiscussion } = useFirestore('discussions');
      const { getAllItems: getResponses } = useFirestore('responses');
  
      const discussionId = route.params.id;
      const discussion = ref(null);
      const responses = ref([]);
  
      const loadDiscussion = async () => {
        const data = await getDiscussion(discussionId);
        discussion.value = data;
      };
  
      const loadResponses = async () => {
        const data = await getResponses({ field: 'discussionId', value: discussionId }, true);
        responses.value = data;
      };
  
      onMounted(() => {
        loadDiscussion();
        loadResponses();
      });
  
      const isLoggedIn = computed(() => currentUser.value !== null);
  
      return {
        discussionId,
        discussion,
        responses,
        isLoggedIn,
        loadResponses
      };
    }
  };
  </script>
