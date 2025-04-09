<template>
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
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useFirestore } from '@/composables/useFirestore';
  import { useAuth } from '@/composables/useAuth';
  
  export default {
    name: 'ReportButton',
    props: {
      contentId: {
        type: String,
        required: true
      },
      contentType: {
        type: String,
        required: true,
        validator: value => ['discussion', 'response'].includes(value)
      },
      authorId: {
        type: String,
        required: true
      },
      discussionId: {
        type: String,
        default: null
      }
    },
    setup(props) {
      const showModal = ref(false);
      const reportReason = ref('inappropriate');
      const reportDetails = ref('');
      const { addItem } = useFirestore('reports');
      const { currentUser } = useAuth();
      
      const reportReasons = [
        { value: 'inappropriate', text: 'Contenu inapproprié' },
        { value: 'spam', text: 'Spam' },
        { value: 'harassment', text: 'Harcèlement' },
        { value: 'misinformation', text: 'Fausses informations' },
        { value: 'other', text: 'Autre' }
      ];
      
      const showReportModal = () => {
        showModal.value = true;
      };
      
      const submitReport = async () => {
        if (!currentUser.value) return;
        
        try {
          const reportData = {
            contentId: props.contentId,
            contentType: props.contentType,
            authorId: props.authorId,
            reportedBy: currentUser.value.uid,
            reporterName: currentUser.value.displayName || 'Anonymous',
            reason: reportReason.value,
            details: reportDetails.value,
            status: 'pending'
          };
          
          // Add discussionId if this is a response report
          if (props.contentType === 'response' && props.discussionId) {
            reportData.discussionId = props.discussionId;
          }
          
          await addItem(reportData);
          
          alert('Merci pour votre signalement. Un modérateur l\'examinera prochainement.');
          
          // Reset form
          reportReason.value = 'inappropriate';
          reportDetails.value = '';
        } catch (error) {
          console.error('Error submitting report:', error);
          alert('Erreur lors du signalement. Veuillez réessayer.');
        }
      };
      
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