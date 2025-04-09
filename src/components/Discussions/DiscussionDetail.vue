<template>
    <b-card class="mb-3">
      <h3>{{ discussion.title }}</h3>
      <p class="text-muted">
        Catégorie: {{ discussion.category }} |
        Auteur: {{ discussion.authorName }} |
        Publié le: {{ discussionDate }}
      </p>
      <p>{{ discussion.content }}</p>
      <div>
        <b-button v-if="canEdit" variant="warning" @click="editDiscussion">Modifier</b-button>
        <b-button v-if="canDelete" variant="danger" @click="deleteDiscussion">Supprimer</b-button>
      </div>
    </b-card>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import { useFirestore } from '@/composables/useFirestore';
  import { useModerator } from '@/composables/useModerator';
  
  export default {
    name: 'DiscussionDetail',
    props: {
      discussion: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const { currentUser } = useAuth();
      const { deleteItem } = useFirestore('discussions');
      const { isModerator } = useModerator();
  
      const discussionDate = ref(props.discussion.createdAt ? props.discussion.createdAt.toDate?.().toLocaleString() : 'Date inconnue');
  
      // Droits pour modifier/supprimer : soit propriétaire, soit modérateur
      const canEdit = computed(() => {
        return currentUser.value && currentUser.value.uid === props.discussion.authorId;
      });
      const canDelete = computed(() => {
        if (!currentUser.value) return false;
        return (currentUser.value.uid === props.discussion.authorId) || isModerator.value;
      });
  
      const editDiscussion = () => {
        // Logique pour éditer la discussion (ouvrir un modal, par ex. ou router vers un composant d'édition).
        alert("Fonction 'Modifier' à implémenter");
      };
  
      const deleteDiscussion = async () => {
        if (!canDelete.value) return;
        await deleteItem(props.discussion.id);
        // Rediriger l'utilisateur, par exemple
        window.location.href = '/';
      };
  
      return {
        discussionDate,
        canEdit,
        canDelete,
        editDiscussion,
        deleteDiscussion
      };
    }
  };
  </script>
  