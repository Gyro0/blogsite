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
      // ID of the parent discussion
      discussionId: {
        type: String,
        required: true
      }
    },
    emits: ['response-added'],
    setup(props, { emit }) {
      // --------------------------------------------------------------
      // State Management
      // --------------------------------------------------------------
      
      // Form data
      const content = ref('');
      
      // Get current user
      const { currentUser } = useAuth();
      
      // Get Firestore utilities
      const { addItem, isLoading } = useFirestore('responses');
      
      // --------------------------------------------------------------
      // Form Submission
      // --------------------------------------------------------------
    
      const submitResponse = async () => {
        // Validate required fields
        if (!currentUser.value || !content.value.trim()) return;
        
        // Create the response in Firestore
        const result = await addItem({
          content: content.value.trim(),
          authorId: currentUser.value.uid,
          authorName: currentUser.value.displayName || 'Inconnu',
          discussionId: props.discussionId,
          createdAt: new Date()
        });
        
        if (result) {
          // Clear the form
          content.value = '';
          
          // Emit event to parent to refresh responses
          emit('response-added');
        }
      };
      
      // --------------------------------------------------------------
      // Expose component API
      // --------------------------------------------------------------
      return {
        content,
        isLoading,
        submitResponse
      };
    }
  };
  </script>
