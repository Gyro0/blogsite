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
    ReportButton // Component for reporting responses
  },
  props: {
    // Response data object
    response: {
      type: Object,
      required: true
    }
  },
  emits: ['response-deleted', 'response-updated'],
  setup(props, { emit }) {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Get current user and moderator status
    const { currentUser } = useAuth();
    
    // Get Firestore utilities
    const { deleteItem, updateItem } = useFirestore('responses');
    
    // Get moderator utilities
    const { isModerator } = useModerator();
    
    // Edit state
    const isEditing = ref(false);
    const editContent = ref('');
    
    // --------------------------------------------------------------
    // Computed Properties
    // --------------------------------------------------------------
    
    // Only authors can edit their own responses
    const canEdit = computed(() => 
      currentUser.value && currentUser.value.uid === props.response.authorId
    );

    // Authors and moderators can delete
    const canDelete = computed(() => 
      currentUser.value && (currentUser.value.uid === props.response.authorId || isModerator.value)
    );
    
    // --------------------------------------------------------------
    // User Interactions
    // --------------------------------------------------------------

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
      
      // Update response in Firestore
      const result = await updateItem(props.response.id, {
        content: editContent.value.trim(),
        updatedAt: new Date()
      });
      
      if (result) {
        isEditing.value = false;
        
        // Emit event to refresh the response list
        emit('response-updated', {
          id: props.response.id,
          content: editContent.value.trim()
        });
      }
    };

    // Delete the response
    const deleteResponse = async () => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette réponse?')) return;
      
      try {
        // Delete from Firestore
        const result = await deleteItem(props.response.id);
        
        if (result) {
          // Emit event when deletion is successful
          emit('response-deleted', props.response.id);
        }
      } catch (error) {
        console.error("Error deleting response:", error);
      }
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      canEdit,
      canDelete,
      isEditing,
      editContent,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteResponse,
      currentUser
    };
  }
};
</script>

<style scoped>
.mr-2 {
  margin-right: 0.5rem;
}
</style>
