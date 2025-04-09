<template>
  <b-card title="Signalements">
    <div v-if="isLoading" class="text-center">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    
    <div v-else-if="reports.length === 0" class="alert alert-info">
      Aucun signalement à traiter.
    </div>
    
    <b-table v-else :items="reports" :fields="fields" responsive>
      <template #cell(reason)="data">
        <b-badge :variant="getReasonVariant(data.item.reason)">{{ formatReason(data.item.reason) }}</b-badge>
      </template>
      
      <template #cell(status)="data">
        <b-badge :variant="getStatusVariant(data.item.status)">{{ formatStatus(data.item.status) }}</b-badge>
      </template>
      
      <template #cell(actions)="data">
        <b-button-group size="sm">
          <b-button variant="primary" @click="viewContent(data.item)">
            Voir
          </b-button>
          <b-button variant="success" @click="resolveReport(data.item.id)">
            Résoudre
          </b-button>
          <b-button variant="danger" @click="deleteReportedContent(data.item)">
            Supprimer contenu
          </b-button>
        </b-button-group>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { useRouter } from 'vue-router';
import { useModerator } from '@/composables/useModerator';

export default {
  name: 'ReportList',
  setup() {
    const reports = ref([]);
    const { getAllItems, updateItem, deleteItem, isLoading } = useFirestore('reports');
    const { removeMessage } = useModerator();
    const router = useRouter();
    
    const refreshAuth = async () => {
      try {
        // Force a new token if already authenticated
        if (auth.currentUser) {
          await auth.currentUser.getIdToken(true);
          console.log("Auth token refreshed");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    const fields = [
      { key: 'contentType', label: 'Type' },
      { key: 'reporterName', label: 'Signalé par' },
      { key: 'reason', label: 'Raison' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Statut' },
      { key: 'actions', label: 'Actions' }
    ];
    
    const loadReports = async () => {
      try {
        console.log("Fetching reports...");
        // Get all reports (not just pending ones)
        const allReports = await getAllItems({}, true);
        console.log("All reports in database:", allReports);
        
        // Process all reports to show in the table
        reports.value = allReports.map(report => ({
          ...report,
          date: report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleString() : 'N/A'
        }));
        
        // Alternatively, add a filter toggle to show pending/all reports
        // const showFilteredReports = () => {
        //   const reportData = showAllReports.value 
        //     ? allReports 
        //     : allReports.filter(r => r.status === 'pending');
        //   
        //   reports.value = reportData.map(report => ({
        //     ...report,
        //     date: report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleString() : 'N/A'
        //   }));
        // };
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    };
    
    const getReasonVariant = (reason) => {
      const variants = {
        inappropriate: 'danger',
        spam: 'warning',
        harassment: 'danger',
        misinformation: 'info',
        other: 'secondary'
      };
      return variants[reason] || 'secondary';
    };
    
    const formatReason = (reason) => {
      const reasons = {
        inappropriate: 'Contenu inapproprié',
        spam: 'Spam',
        harassment: 'Harcèlement',
        misinformation: 'Fausses informations',
        other: 'Autre'
      };
      return reasons[reason] || reason;
    };
    
    const getStatusVariant = (status) => {
      const variants = {
        pending: 'warning',
        resolved: 'success',
        rejected: 'danger'
      };
      return variants[status] || 'secondary';
    };
    
    const formatStatus = (status) => {
      const statuses = {
        pending: 'En attente',
        resolved: 'Résolu',
        rejected: 'Rejeté'
      };
      return statuses[status] || status;
    };
    
    const viewContent = (report) => {
      try {
        if (report.contentType === 'discussion') {
          console.log("Navigating to discussion:", report.contentId);
          router.push(`/discussion/${report.contentId}`);
        } else if (report.contentType === 'response' && report.discussionId) {
          // For responses, navigate to the parent discussion using the stored discussionId
          console.log("Navigating to parent discussion:", report.discussionId);
          router.push(`/discussion/${report.discussionId}`);
        } else {
          console.error("Cannot navigate: Missing discussionId for response report", report);
          alert("Impossible d'afficher ce contenu: ID de discussion manquant");
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };
    
    // Only mark the report as resolved without deleting content
    const resolveReport = async (reportId) => {
      try {
        await updateItem(reportId, {
          status: 'resolved',
          resolvedAt: new Date(),
          resolution: 'resolved_by_moderator'
        });
        console.log("Report marked as resolved");
        await loadReports();
      } catch (error) {
        console.error("Error resolving report:", error);
        alert("Erreur lors de la résolution du signalement");
      }
    };
    
    // Delete the content and mark the report as resolved with content_deleted reason
    const deleteReportedContent = async (report) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu?')) {
        await refreshAuth();
        try {
          // First step: Delete the reported content
          let contentDeleted = false;
          
          if (report.contentType === 'discussion') {
            contentDeleted = await removeMessage('discussions', report.contentId);
            console.log("Discussion deletion result:", contentDeleted, "ID:", report.contentId);
          } else {
            contentDeleted = await removeMessage('responses', report.contentId);
            console.log("Response deletion result:", contentDeleted, "ID:", report.contentId);
          }
          
          // Second step: Mark the report as resolved (not delete it)
          if (contentDeleted) {
            console.log("Marking report as resolved:", report.id);
            
            try {
              // Update the report status in Firestore
              await db.collection('reports').doc(report.id).update({
                status: 'resolved',
                resolvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                resolution: 'content_deleted',
                moderationNote: 'Contenu supprimé par un modérateur'
              });
              
              // Apply the change locally to the report in the reports array too
              const reportIndex = reports.value.findIndex(r => r.id === report.id);
              if (reportIndex !== -1) {
                reports.value[reportIndex].status = 'resolved';
                reports.value[reportIndex].resolution = 'content_deleted';
              }
              
              console.log("Report successfully marked as resolved");
              alert("Contenu supprimé et signalement RÉSOLU (non supprimé) avec succès");
              
              // Just refresh the list without filtering out resolved reports
              await loadReports();
            } catch (updateError) {
              console.error("Error updating report:", updateError);
              alert("Contenu supprimé mais erreur lors de la résolution du signalement");
            }
          } else {
            console.error("Content deletion failed");
            alert("Échec de la suppression du contenu");
          }
        } catch (error) {
          console.error("Error in deleteReportedContent:", error);
          alert("Une erreur s'est produite: " + error.message);
        }
      }
    };
    
    onMounted(async () => {
      await refreshAuth();
      loadReports();
    });
    
    return {
      reports,
      isLoading,
      fields,
      getReasonVariant,
      formatReason,
      getStatusVariant,
      formatStatus,
      viewContent,
      resolveReport,
      deleteReportedContent
    };
  }
};
</script>
