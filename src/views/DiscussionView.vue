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

  <style scoped>
  .container {
    max-width: 900px;
    margin: 3rem auto 2.5rem auto; /* Added bottom margin */
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
      margin-bottom: 1.5rem;
    }
  }
  </style>
