<template>
  <div class="response-list">
    <h3 class="response-list-title">Réponses</h3>
    <div v-if="responses.length === 0" class="no-responses">
      Aucune réponse pour le moment.
    </div>
    <div v-else class="response-items">
      <ResponseItem
        v-for="resp in responses"
        :key="resp.id"
        :response="resp"
        @response-deleted="handleResponseDeleted"
        @response-updated="handleResponseUpdated"
      />
    </div>
  </div>
</template>

<script>
import ResponseItem from './ResponseItem.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ResponseList',
  components: {
    ResponseItem // Child component for individual responses
  },
  props: {
    // Array of response data objects
    responses: {
      type: Array,
      default: () => []
    }
  },
  emits: ['response-deleted', 'response-updated'],
  setup(props, { emit }) {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Router for navigation
    const router = useRouter();
    
    // --------------------------------------------------------------
    // Event Handlers
    // --------------------------------------------------------------
    
    // Handle response deletion from child component
    const handleResponseDeleted = (responseId) => {
      // Refresh the page to update the list
      router.go(0);
    };
    
    // Handle response updates from child component
    const handleResponseUpdated = (updatedResponse) => {
      // Refresh the page to show the updated content
      router.go(0);
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      handleResponseDeleted,
      handleResponseUpdated
    };
  }
};
</script>

<style scoped>
.response-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.response-list-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #23405a;
  margin-bottom: 1rem;
}

.no-responses {
  text-align: center;
  color: #23405a;
  font-size: 1.2rem;
  font-weight: 600;
  background: #e4edf2;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1.5px solid #bbdcf0;
  box-shadow: 0 2px 24px #a8daf955;
}

.response-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
