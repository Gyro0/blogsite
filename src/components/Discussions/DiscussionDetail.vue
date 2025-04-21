<template>
  <div class="discussion-detail">
    <!-- Header Section -->
    <div class="discussion-header">
      <div class="discussion-badges">
        <span class="badge category">{{ discussion.category }}</span>
        <span v-if="discussion.subcategory" class="badge subcategory">{{ discussion.subcategory }}</span>
      </div>
      <div v-if="isModeratorUser" class="moderator-badge">
        <i class="bi bi-shield"></i> Modérateur
      </div>
    </div>

    <!-- Title -->
    <h1 class="discussion-title">{{ discussion.title }}</h1>

    <!-- Author Info -->
    <div class="author-info">
      <div class="author-avatar">{{ getInitials(discussion.authorName) }}</div>
      <div class="author-details">
        <span class="author-name">{{ discussion.authorName }}</span>
        <span class="discussion-date">Publié le {{ discussionDate }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="discussion-content">
      <p>{{ discussion.content }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="discussion-actions">
      <button v-if="canEdit" class="action-btn edit-btn" @click="editDiscussion">
        <i class="bi bi-pencil-square"></i> Modifier
      </button>
      <button v-if="canDelete" class="action-btn delete-btn" @click="confirmDelete">
        <i class="bi bi-trash"></i> Supprimer
      </button>
      <ReportButton
        v-if="currentUser && currentUser.uid !== discussion.authorId && !isModeratorUser"
        :contentId="discussion.id"
        contentType="discussion"
        :authorId="discussion.authorId"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="delete-modal">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer cette discussion ? Cette action est irréversible.</p>
        <div class="modal-actions">
          <button class="action-btn cancel-btn" @click="showDeleteModal = false">Annuler</button>
          <button class="action-btn danger-btn" @click="deleteDiscussion">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
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
  components: { ReportButton },
  props: {
    discussion: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { currentUser } = useAuth();
    const { deleteItem, updateItem } = useFirestore('discussions');
    const { isModerator } = useModerator();
    const router = useRouter();

    const showDeleteModal = ref(false);

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

    const isAuthor = computed(() => currentUser.value?.uid === props.discussion.authorId);
    const canModerate = computed(() => currentUser.value && isModerator.value);
    const canEdit = computed(() => isAuthor.value || canModerate.value);
    const canDelete = computed(() => isAuthor.value || canModerate.value);
    const isModeratorUser = computed(() => isModerator.value);

    const getInitials = (name) => {
      if (!name) return '?';
      return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    };

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

    const confirmDelete = () => {
      showDeleteModal.value = true;
    };

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
      getInitials
    };
  }
};
</script>

<style scoped>
.discussion-detail {
  max-width: 800px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
}

.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.discussion-badges .badge {
  background: #e4edf2;
  color: #23405a;
  border-radius: 1rem;
  padding: 0.3rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.moderator-badge {
  background: #92d2f9;
  color: #fff;
  border-radius: 1rem;
  padding: 0.3rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.discussion-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #92d2f9;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.author-avatar {
  background: #92d2f9;
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #23405a;
}

.discussion-date {
  font-size: 0.9rem;
  color: #92d2f9;
}

.discussion-content {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.discussion-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.action-btn {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  border: none;
  border-radius: 1.2rem;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.action-btn:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  transform: translateY(-2px);
}

.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background: #e4edf2;
  color: #23405a;
}

.danger-btn {
  background: #ffb3b3;
  color: #a94442;
}
</style>