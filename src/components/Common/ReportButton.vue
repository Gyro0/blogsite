<template>
  <div>
    <b-button variant="outline-warning" size="sm" @click="showReportModal">
      <i class="bi bi-flag"></i> Signaler
    </b-button>
    
    <b-modal v-model="showModal" title="Signaler un contenu" @ok="submitReport">
      <b-form-group label="Raison du signalement:">
        <b-form-select v-model="reportReason" :options="reportReasons"></b-form-select>
      </b-form-group>
      <b-form-group label="Détails supplémentaires:">
        <b-form-textarea v-model="reportDetails" placeholder="Précisez votre signalement..." rows="3"></b-form-textarea>
      </b-form-group>
    </b-modal>
  </div>
</template>
  
<script>
  import { ref } from 'vue';
  import { useFirestore } from '@/composables/useFirestore';
  import { useAuth } from '@/composables/useAuth';
  
  export default {
    name: 'ReportButton',
    props: {
      // ID of the content being reported
      contentId: {
        type: String,
        required: true
      },
      // Type of content (discussion/response)
      contentType: {
        type: String,
        required: true,
        validator: value => ['discussion', 'response'].includes(value)
      },
      // ID of the author of the content
      authorId: {
        type: String,
        required: true
      },
      // Parent discussion ID (for responses)
      discussionId: {
        type: String,
        default: null
      }
    },
    setup(props) {
      // --------------------------------------------------------------
      // State Management
      // --------------------------------------------------------------
      
      // Control modal visibility
      const showModal = ref(false);
      
      // Form data
      const reportReason = ref('inappropriate');
      const reportDetails = ref('');
      
      // Get Firestore and Auth utilities
      const { addItem } = useFirestore('reports');
      const { currentUser } = useAuth();
      
      // Options for report reasons dropdown
      const reportReasons = [
        { value: 'inappropriate', text: 'Contenu inapproprié' },
        { value: 'spam', text: 'Spam' },
        { value: 'harassment', text: 'Harcèlement' },
        { value: 'misinformation', text: 'Fausses informations' },
        { value: 'other', text: 'Autre' }
      ];
      
      // --------------------------------------------------------------
      // User Interactions
      // --------------------------------------------------------------
      
      // Show the report modal dialog
      const showReportModal = () => {
        showModal.value = true;
      };
      
      // Submit report data to Firestore
      const submitReport = async () => {
        if (!currentUser.value) return;
        
        // Build report data
        const reportData = {
          contentId: props.contentId,
          contentType: props.contentType,
          authorId: props.authorId,
          reportedBy: currentUser.value.uid,
          reporterName: currentUser.value.displayName || 'Anonymous',
          reason: reportReason.value,
          details: reportDetails.value,
          status: 'pending',
          createdAt: new Date()
        };
        
        // Add discussionId if this is a response report
        if (props.contentType === 'response' && props.discussionId) {
          reportData.discussionId = props.discussionId;
        }
        
        // Submit to Firestore
        await addItem(reportData);
        
        // Show success message
        alert('Merci pour votre signalement. Un modérateur l\'examinera prochainement.');
        
        // Reset form
        reportReason.value = 'inappropriate';
        reportDetails.value = '';
        
        // Close modal
        showModal.value = false;
      };
      
      // --------------------------------------------------------------
      // Expose component API
      // --------------------------------------------------------------
      return {
        showModal,
        reportReason,
        reportDetails,
        reportReasons,
        showReportModal,
        submitReport
      };
    }
  };
</script>