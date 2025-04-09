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
    setup(props) {
      const content = ref('');
      const { currentUser } = useAuth();
      const { addItem, isLoading } = useFirestore('responses');
  
      const submitResponse = async () => {
        if (!currentUser.value) return;
        await addItem({
          content: content.value,
          authorId: currentUser.value.uid,
          authorName: currentUser.value.displayName || 'Inconnu',
          discussionId: props.discussionId
        });
        content.value = '';
      };
  
      return {
        content,
        isLoading,
        submitResponse
      };
    }
  };
  </script>
  