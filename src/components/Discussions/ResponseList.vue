<template>
  <div>
    <h3>Réponses</h3>
    <div v-if="responses.length === 0" class="alert alert-info">
      Aucune réponse pour le moment.
    </div>
    <b-list-group>
      <ResponseItem
        v-for="resp in responses"
        :key="resp.id"
        :response="resp"
        @response-deleted="handleResponseDeleted"
        @response-updated="handleResponseUpdated"
      />
    </b-list-group>
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
