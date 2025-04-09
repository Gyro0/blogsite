<template>
    <b-form @submit.prevent="submitResponse">
      <b-form-textarea
        v-model="content"
        placeholder="Écrivez votre réponse..."
        required
      ></b-form-textarea>
      <b-button variant="primary" class="mt-2" type="submit" :disabled="isLoading">Répondre</b-button>
    </b-form>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import { useFirestore } from '@/composables/useFirestore';
  
  export default {
    name: 'ResponseForm',
    props: {
      discussionId: {
        type: String,
        required: true
      }
    },
    emits: ['response-added'],
    setup(props, { emit }) {
      const content = ref('');
      const { currentUser } = useAuth();
      const { addItem, isLoading } = useFirestore('responses');
  
      const submitResponse = async () => {
        if (!currentUser.value || !content.value.trim()) return;
        
        console.log("Submitting response for discussionId:", props.discussionId);
        
        const result = await addItem({
          content: content.value,
          authorId: currentUser.value.uid,
          authorName: currentUser.value.displayName || 'Inconnu',
          discussionId: props.discussionId,
          // Add a timestamp field explicitly for testing
          timestamp: new Date().toISOString()
        });
        
        console.log("Response submit result:", result);
        console.log("Response document ID:", result ? result.id : null);
        
        if (result) {
          // Clear the form
          content.value = '';
          
          // Emit event to parent that a response was added
          emit('response-added');
          
          console.log('Response added successfully!');
        }
      };
  
      return {
        content,
        isLoading,
        submitResponse
      };
    }
  };
  </script>
