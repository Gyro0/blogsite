<template>
  <b-card class="discussion-detail-card mb-4">
    <!-- Header with title and badges -->
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <b-badge variant="secondary" class="mr-2">
            {{ discussion.category }}
          </b-badge>
          <b-badge v-if="discussion.subcategory" variant="light">
            {{ discussion.subcategory }}
          </b-badge>
        </div>
        <div>
          <b-badge v-if="isModeratorUser" variant="info">
            Modérateur
          </b-badge>
        </div>
      </div>
    </template>
    
    <!-- Discussion title -->
    <h2 class="mb-3">{{ discussion.title }}</h2>
    
    <!-- Author info and publication date -->
    <div class="author-info mb-4">
      <div class="d-flex align-items-center">
        <b-avatar variant="secondary" class="mr-2" text-variant="white">
          {{ getInitials(discussion.authorName) }}
        </b-avatar>
        <div>
          <div class="font-weight-bold">{{ discussion.authorName }}</div>
          <small class="text-muted">Publié le {{ discussionDate }}</small>
        </div>
      </div>
    </div>
    
    <!-- Discussion content -->
    <div class="discussion-content mb-4">
      <p>{{ discussion.content }}</p>
    </div>
    
    <!-- Action buttons -->
    <div class="d-flex align-items-center mt-4">
      <!-- Edit button for author and moderators -->
      <b-button 
        v-if="canEdit" 
        variant="outline-warning" 
        size="sm"
        class="mr-2" 
        @click="editDiscussion"
      >
        <i class="bi bi-pencil-square"></i> Modifier
      </b-button>
      
      <!-- Delete button for author and moderators -->
      <b-button 
        v-if="canDelete" 
        variant="outline-danger" 
        size="sm" 
        class="mr-2" 
        @click="confirmDelete"
      >
        <i class="bi bi-trash"></i> Supprimer
      </b-button>
      
      <!-- Report button for regular users -->
      <ReportButton 
        v-if="currentUser && currentUser.uid !== discussion.authorId && !isModeratorUser"
        :contentId="discussion.id"
        contentType="discussion"
        :authorId="discussion.authorId"
      />
      
      <!-- Moderation indicator -->
      <small v-if="canModerate && !isAuthor" class="text-muted ml-auto">
        <i class="bi bi-shield"></i> Action modérateur
      </small>
    </div>
    
    <!-- Confirmation modal for deletion -->
    <b-modal 
      v-model="showDeleteModal" 
      title="Confirmer la suppression" 
      @ok="deleteDiscussion" 
      ok-variant="danger"
      ok-title="Supprimer"
      cancel-title="Annuler"
    >
      <p>Êtes-vous sûr de vouloir supprimer cette discussion? Cette action est irréversible.</p>
    </b-modal>
  </b-card>
</template>

<script>
import { ref, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFirestore } from '@/composables/useFirestore';
import { useModerator } from '@/composables/useModerator';
import { useRouter } from 'vue-router';
import ReportButton from '@/components/Common/ReportButton.vue';

export default {
  name: 'DiscussionDetail',
  components: {
    ReportButton // Component for reporting content
  },
  props: {
    // Discussion data object
    discussion: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Get current user and moderator status
    const { currentUser } = useAuth();
    
    // Get Firestore utilities
    const { deleteItem, updateItem } = useFirestore('discussions');
    
    // Get moderator utilities
    const { isModerator } = useModerator();
    
    // For navigation
    const router = useRouter();
    
    // Control deletion confirmation modal
    const showDeleteModal = ref(false);
    
    // --------------------------------------------------------------
    // Computed Properties
    // --------------------------------------------------------------
    
    // Format the discussion creation date
    const discussionDate = computed(() => {
      if (!props.discussion.createdAt) return 'Date inconnue';
      
      const date = props.discussion.createdAt.seconds 
        ? new Date(props.discussion.createdAt.seconds * 1000) 
        : new Date(props.discussion.createdAt);
      
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });

    // Check if current user is the author
    const isAuthor = computed(() => {
      return currentUser.value && currentUser.value.uid === props.discussion.authorId;
    });
    
    // Check if current user can moderate content
    const canModerate = computed(() => {
      return currentUser.value && isModerator.value;
    });

    // Access rights for edit: either owner or moderator
    const canEdit = computed(() => {
      return isAuthor.value || canModerate.value;
    });
    
    // Access rights for delete: either owner or moderator
    const canDelete = computed(() => {
      return isAuthor.value || canModerate.value;
    });

    // Flag to show moderator status in UI
    const isModeratorUser = computed(() => {
      return isModerator.value;
    });
    
    // --------------------------------------------------------------
    // Helper Functions
    // --------------------------------------------------------------

    // Get user initials for avatar
    const getInitials = (name) => {
      if (!name) return '?';
      return name.split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    };
    
    // --------------------------------------------------------------
    // User Interactions
    // --------------------------------------------------------------

    // Start edit process
    const editDiscussion = async () => {
      // If moderator is editing someone else's discussion, we need to handle it differently
      if (canModerate.value && !isAuthor.value) {
        // Add moderator information to track changes
        await updateItem(props.discussion.id, {
          lastModeratedBy: currentUser.value.uid,
          moderatedAt: new Date()
        });
      }
      
      // Navigate to edit page
      router.push(`/edit-discussion/${props.discussion.id}`);
    };

    // Show delete confirmation modal
    const confirmDelete = () => {
      showDeleteModal.value = true;
    };

    // Delete the discussion
    const deleteDiscussion = async () => {
      if (!canDelete.value) return;
      
      // If a moderator is deleting, log that in Firebase
      if (canModerate.value && !isAuthor.value) {
        // Log this moderation action
        const { addItem } = useFirestore('moderation_logs');
        await addItem({
          action: 'delete_discussion',
          contentId: props.discussion.id,
          moderatorId: currentUser.value.uid,
          moderatorName: currentUser.value.displayName || 'Unknown',
          authorId: props.discussion.authorId,
          timestamp: new Date(),
          title: props.discussion.title,
          reason: 'Modération'
        });
      }
      
      // Delete the discussion document
      await deleteItem(props.discussion.id);
      
      // Navigate back to home page
      router.push('/');
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      discussionDate,
      isAuthor,
      canModerate,
      canEdit,
      canDelete,
      isModeratorUser,
      showDeleteModal,
      editDiscussion,
      confirmDelete,
      deleteDiscussion,
      currentUser,
      getInitials
    };
  }
};
</script>

<style scoped>
.discussion-detail-card {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.discussion-content {
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
}

.author-info {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.mr-2 {
  margin-right: 0.5rem;
}

.ml-auto {
  margin-left: auto;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}
</style>