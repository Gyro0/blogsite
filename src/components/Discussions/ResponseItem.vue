<template>
  <div class="response-item">
    <div class="response-header">
      <div class="author-info">
        <div class="author-avatar">{{ getInitials(response.authorName) }}</div>
        <div class="author-details">
          <h5 class="author-name">{{ response.authorName }}</h5>
          <small class="response-date">{{ formatDate(response.createdAt) }}</small>
        </div>
      </div>
      <div class="response-actions" v-if="!isEditing">
        <button v-if="canEdit" class="action-btn edit-btn" @click="startEdit">Modifier</button>
        <button v-if="canDelete" class="action-btn delete-btn" @click="deleteResponse">Supprimer</button>
        <ReportButton
          v-if="currentUser && currentUser.uid !== response.authorId"
          :contentId="response.id"
          contentType="response"
          :authorId="response.authorId"
          :discussionId="response.discussionId"
        />
      </div>
    </div>

    <div class="response-content">
      <p v-if="!isEditing">{{ response.content }}</p>
      <div v-else>
        <form @submit.prevent="saveEdit">
          <textarea v-model="editContent" rows="3" class="edit-textarea" required></textarea>
          <div class="edit-actions">
            <button type="submit" class="action-btn save-btn">Enregistrer</button>
            <button type="button" class="action-btn cancel-btn" @click="cancelEdit">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFirestore } from '@/composables/useFirestore';
import { useModerator } from '@/composables/useModerator';
import ReportButton from '@/components/Common/ReportButton.vue';

export default {
  name: 'ResponseItem',
  components: { ReportButton },
  props: {
    response: {
      type: Object,
      required: true
    }
  },
  emits: ['response-deleted', 'response-updated'],
  setup(props, { emit }) {
    const { currentUser } = useAuth();
    const { deleteItem, updateItem } = useFirestore('responses');
    const { isModerator } = useModerator();

    const isEditing = ref(false);
    const editContent = ref('');

    const canEdit = computed(() => currentUser.value?.uid === props.response.authorId);
    const canDelete = computed(() => currentUser.value?.uid === props.response.authorId || isModerator.value);

    const startEdit = () => {
      editContent.value = props.response.content;
      isEditing.value = true;
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editContent.value = '';
    };

    const saveEdit = async () => {
      if (!editContent.value.trim()) return;

      const result = await updateItem(props.response.id, {
        content: editContent.value.trim(),
        updatedAt: new Date()
      });

      if (result) {
        isEditing.value = false;
        emit('response-updated', { id: props.response.id, content: editContent.value.trim() });
      }
    };

    const deleteResponse = async () => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) return;

      const result = await deleteItem(props.response.id);
      if (result) emit('response-deleted', props.response.id);
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Date inconnue';
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getInitials = (name) => {
      if (!name) return '?';
      return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    };

    return {
      isEditing,
      editContent,
      canEdit,
      canDelete,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteResponse,
      formatDate,
      getInitials,
      currentUser
    };
  }
};
</script>

<style scoped>
.response-item {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 1.5rem;
  border: 1.5px solid #bbdcf0;
  margin-bottom: 1.5rem;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  background: #92d2f9;
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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

.response-date {
  font-size: 0.9rem;
  color: #92d2f9;
}

.response-content {
  font-size: 1rem;
  color: #23405a;
  line-height: 1.5;
}

.edit-textarea {
  width: 100%;
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  outline: none;
  resize: none;
  transition: border 0.18s;
}

.edit-textarea:focus {
  border-color: #a8daf9;
}

.edit-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.action-btn {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.action-btn:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  transform: translateY(-2px);
}

.delete-btn {
  background: linear-gradient(90deg, #ffb3b3 0%, #ffe4e4 100%);
  color: #a94442;
}

.delete-btn:hover {
  background: linear-gradient(90deg, #ffe4e4 0%, #ffb3b3 100%);
}

.cancel-btn {
  background: #e4edf2;
  color: #23405a;
}

.cancel-btn:hover {
  background: #cde2ee;
}
</style>
