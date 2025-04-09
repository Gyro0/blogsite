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
    ResponseItem
  },
  props: {
    responses: {
      type: Array,
      default: () => []
    }
  },
  emits: ['response-deleted', 'response-updated'],
  setup(props, { emit }) {
    const router = useRouter();
    
    const handleResponseDeleted = (responseId) => {
      console.log("Response deleted in list:", responseId);
      // Refresh the page to update the list
      router.go(0);
    };
    
    const handleResponseUpdated = (updatedResponse) => {
      console.log("Response updated in list:", updatedResponse);
      // Refresh the page to show the updated content
      router.go(0);
    };

    return {
      handleResponseDeleted,
      handleResponseUpdated
    };
  }
};
</script>
