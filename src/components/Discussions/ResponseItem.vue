<template>
    <b-list-group-item class="d-flex justify-content-between align-items-start">
      <div>
        <div class="fw-bold">{{ response.authorName }}</div>
        <p>{{ response.content }}</p>
        <small class="text-muted">{{ responseDate }}</small>
      </div>
      <div>
        <b-button v-if="canEdit" variant="warning" size="sm" @click="editResponse">Modifier</b-button>
        <b-button v-if="canDelete" variant="danger" size="sm" @click="deleteResponse">Supprimer</b-button>
      </div>
    </b-list-group-item>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import { useFirestore } from '@/composables/useFirestore';
  import { useModerator } from '@/composables/useModerator';
  
  export default {
    name: 'ResponseItem',
    props: {
      response: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const { currentUser } = useAuth();
      const { deleteItem } = useFirestore('responses');
      const { isModerator } = useModerator();
  
      const responseDate = ref(props.response.createdAt ? props.response.createdAt.toDate?.().toLocaleString() : 'Date inconnue');
  
      const canEdit = computed(() => {
        return currentUser.value && currentUser.value.uid === props.response.authorId;
      });
  
      const canDelete = computed(() => {
        return canEdit.value || isModerator.value;
      });
  
      const editResponse = () => {
        // Logique pour éditer (modal, form inline, etc.)
        alert("Fonction 'Modifier' à implémenter");
      };
  
      const deleteResponse = async () => {
        if (!canDelete.value) return;
        await deleteItem(props.response.id);
      };
  
      return {
        responseDate,
        canEdit,
        canDelete,
        editResponse,
        deleteResponse
      };
    }
  };
  </script>
  