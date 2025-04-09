<template>
  <b-list-group-item>
    <div class="d-flex justify-content-between align-items-start">
      <div class="w-100">
        <h5>{{ response.authorName }}</h5>
        
        <!-- Show this when not editing -->
        <div v-if="!isEditing">
          <p>{{ response.content }}</p>
        </div>
        
        <!-- Show this when editing -->
        <div v-else>
          <b-form @submit.prevent="saveEdit">
            <b-form-textarea 
              v-model="editContent" 
              rows="3"
              class="mb-2"
              required
            ></b-form-textarea>
            <div>
              <b-button type="submit" variant="success" size="sm" class="mr-2">Enregistrer</b-button>
              <b-button variant="outline-secondary" size="sm" @click="cancelEdit">Annuler</b-button>
            </div>
          </b-form>
        </div>
      </div>
      
      <div v-if="!isEditing">
        <!-- Only show edit button if user is author -->
        <b-button 
          v-if="canEdit" 
          variant="primary" 
          size="sm" 
          class="mr-2"
          @click="startEdit"
        >
          Modifier
        </b-button>
        
        <!-- Only show delete button if user is author or moderator -->
        <b-button 
          v-if="canDelete" 
          variant="danger" 
          size="sm" 
          @click="deleteResponse"
        >
          Supprimer
        </b-button>

        <!-- Show report button if user is not the author -->
        <ReportButton 
          v-if="currentUser && currentUser.uid !== response.authorId"
          :contentId="response.id"
          contentType="response"
          :authorId="response.authorId"
          :discussionId="response.discussionId"
          class="ml-2"
        />
      </div>
    </div>
  </b-list-group-item>
</template>

<script>
import { ref, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFirestore } from '@/composables/useFirestore';
import { useModerator } from '@/composables/useModerator';
import ReportButton from '@/components/Common/ReportButton.vue';

export default {
  name: 'ResponseItem',
  components: {
    ReportButton
  },
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
    
    // Edit state
    const isEditing = ref(false);
    const editContent = ref('');
    
    // Only authors can edit
    const canEdit = computed(() => {
      if (!currentUser.value) return false;
      return currentUser.value.uid === props.response.authorId;
    });

    // Authors and moderators can delete
    const canDelete = computed(() => {
      if (!currentUser.value) return false;
      return currentUser.value.uid === props.response.authorId || isModerator.value;
    });

    // Start editing
    const startEdit = () => {
      editContent.value = props.response.content;
      isEditing.value = true;
    };
    
    // Cancel editing
    const cancelEdit = () => {
      isEditing.value = false;
      editContent.value = '';
    };
    
    // Save the edited response
    const saveEdit = async () => {
      if (!editContent.value.trim()) return;
      
      try {
        console.log(`Updating response ${props.response.id} with new content`);
        
        const result = await updateItem(props.response.id, {
          content: editContent.value.trim(),
          updatedAt: new Date()
        });
        
        if (result) {
          console.log("Response updated successfully");
          isEditing.value = false;
          
          // Emit event to refresh the response list
          emit('response-updated', {
            id: props.response.id,
            content: editContent.value.trim()
          });
        }
      } catch (error) {
        console.error("Error updating response:", error);
      }
    };

    const deleteResponse = async () => {
      try {
        console.log("Deleting response:", props.response.id);
        const result = await deleteItem(props.response.id);
        
        if (result) {
          console.log("Response deleted successfully");
          // Emit event when deletion is successful
          emit('response-deleted', props.response.id);
        }
      } catch (error) {
        console.error("Error deleting response:", error);
      }
    };

    return {
      canEdit,
      canDelete,
      isEditing,
      editContent,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteResponse,
      currentUser // Add this line
    };
  }
};
</script>

<style scoped>
.mr-2 {
  margin-right: 0.5rem;
}
</style>
