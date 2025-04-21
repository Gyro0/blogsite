<template>
  <b-card title="Signalements">
    <div>
      <!-- Onglets pour basculer entre les signalements et les utilisateurs -->
      <b-tabs content-class="mt-3">
        <b-tab title="Signalements" active>
          <!-- Contenu existant pour les signalements -->
          <b-form-input
            v-model="searchTerm"
            placeholder="Rechercher un signalement..."
            class="mb-3"
          ></b-form-input>
          
          <div v-if="isLoading" class="text-center my-4">
            <b-spinner label="Chargement..."></b-spinner>
            <div class="mt-2">Chargement des signalements...</div>
          </div>
          
          <b-table v-else :items="reports" :fields="fields" responsive>
            <template #cell(reason)="data">
              <b-badge :variant="getReasonVariant(data.item.reason)">{{ formatReason(data.item.reason) }}</b-badge>
            </template>
            
            <template #cell(status)="data">
              <b-badge :variant="getStatusVariant(data.item.status)">{{ formatStatus(data.item.status) }}</b-badge>
            </template>
            
            <template #cell(actions)="data">
              <div v-if="data.item.status !== 'resolved'">
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
              </div>
            </template>
          </b-table>
        </b-tab>

      </b-tabs>
    </div>
  </b-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { useAuth } from '@/composables/useAuth';
import { auth, db, firebase } from '@/firebase/firebaseInit';
import UserManagement from './UserManagement.vue';
import { useRouter } from 'vue-router';
import { useModerator } from '@/composables/useModerator';

export default {
  name: 'ReportList',
  
  // Register child components
  components: {
    UserManagement // Used to manage users in tabs
  },
  
  setup() {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Store reports fetched from Firestore
    const reports = ref([]);
    
    // Track loading state for UI feedback
    const isLoading = ref(true);
    
    // Track search input for filtering reports
    const searchTerm = ref('');
    
    // For navigation to reported content
    const router = useRouter();
    
    // Get utilities from composables
    const { getAllItems, updateItem, deleteItem } = useFirestore('reports');
    const { forceTokenRefresh } = useAuth();
    const { removeMessage } = useModerator();
    
    // --------------------------------------------------------------
    // Table Configuration
    // --------------------------------------------------------------
    
    // Define table column structure
    const fields = [
      { key: 'contentType', label: 'Type' },
      { key: 'reporterName', label: 'Signalé par' },
      { key: 'reason', label: 'Raison' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Statut' },
      { key: 'actions', label: 'Actions' }
    ];
    
    // --------------------------------------------------------------
    // Data Loading
    // --------------------------------------------------------------
    
    // Load reports from Firebase and format dates
    const loadReports = async () => {
      try {
        isLoading.value = true;
        
        // Fetch all reports from Firestore
        const reportsData = await getAllItems({}, true);
        
        // Format timestamps to readable dates
        reports.value = reportsData.map(report => ({
          ...report,
          date: report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleString() : 'N/A'
        }));
      } catch (error) {
        // Minimal error logging to reduce quota usage
        console.error('Erreur critique:', error.message);
      } finally {
        isLoading.value = false;
      }
    };
    
    // --------------------------------------------------------------
    // Badge and Status Formatting Helpers
    // --------------------------------------------------------------
    
    // Determine badge color based on report reason
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
    
    // Format reason code to user-friendly text
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
    
    // Determine badge color based on report status
    const getStatusVariant = (status) => {
      const variants = {
        pending: 'warning',
        resolved: 'success',
        rejected: 'danger'
      };
      return variants[status] || 'secondary';
    };
    
    // Format status code to user-friendly text
    const formatStatus = (status) => {
      const statuses = {
        pending: 'En attente',
        resolved: 'Résolu',
        rejected: 'Rejeté'
      };
      return statuses[status] || status;
    };
    
    // --------------------------------------------------------------
    // Report Actions
    // --------------------------------------------------------------

    // Navigate to the reported content to view it
    const viewContent = (report) => {
      if (report.contentType === 'discussion') {
        // For discussions, navigate directly to the discussion page
        router.push(`/discussion/${report.contentId}`);
      } else if (report.contentType === 'response' && report.discussionId) {
        // For responses, navigate to the parent discussion
        router.push(`/discussion/${report.discussionId}`);
      } else {
        alert("Impossible d'afficher ce contenu: ID de discussion manquant");
      }
    };
    
    // Mark a report as resolved without deleting content
    const resolveReport = async (reportId) => {
      // Update report status in Firestore
      await updateItem(reportId, {
        status: 'resolved',
        resolvedAt: new Date(),
        resolution: 'resolved_by_moderator'
      });
      
      // Reload reports to refresh the list
      await loadReports();
    };
    
    // Delete reported content and resolve the report
    const deleteReportedContent = async (report) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu?')) return;
      
      try {
        // Refresh token to ensure user has proper permissions
        await forceTokenRefresh(); 
        
        let contentDeleted = false;
        
        // Delete content based on its type
        if (report.contentType === 'discussion') {
          contentDeleted = await removeMessage('discussions', report.contentId);
        } else {
          contentDeleted = await removeMessage('responses', report.contentId);
        }
        
        if (contentDeleted) {
          // Update report status to reflect content deletion
          await db.collection('reports').doc(report.id).update({
            status: 'resolved',
            resolvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            resolution: 'content_deleted'
          });
          
          // Update local state for immediate UI feedback
          const reportIndex = reports.value.findIndex(r => r.id === report.id);
          if (reportIndex !== -1) {
            reports.value[reportIndex].status = 'resolved';
            reports.value[reportIndex].resolution = 'content_deleted';
          }
          
          alert("Contenu supprimé et signalement résolu avec succès");
        } else {
          alert("Échec de la suppression du contenu");
        }
      } catch (error) {
        // Minimal error logging
        console.error('Erreur critique:', error.message);
        alert("Une erreur est survenue: " + error.message);
      }
    };
    
    // --------------------------------------------------------------
    // Lifecycle Hooks
    // --------------------------------------------------------------
    
    // Load reports when component is mounted
    onMounted(async () => {
      // Refresh token once at initialization
      await forceTokenRefresh();
      loadReports();
    });
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      reports,
      isLoading,
      searchTerm,
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

<style scoped>
.b-card {
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 18px;
  box-shadow: 0 2px 16px #a8daf955;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  margin-bottom: 2.5rem;
}

.b-tabs {
  background: transparent;
  border: none;
}

.b-tab {
  background: transparent;
  border: none;
}

.b-form-input {
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  box-shadow: 0 1px 4px #a8daf922;
  padding: 0.6rem 1.2rem;
  margin-bottom: 1.2rem;
}

.b-table {
  background: #fff;
  border-radius: 1rem;
  border: 1px solid #bbdcf0;
  box-shadow: 0 1px 8px #a8daf922;
  color: #23405a;
}

.b-badge {
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.97rem;
  padding: 0.35em 1em;
}

.b-badge-danger {
  background: #ffb3b3;
  color: #a94442;
}
.b-badge-warning {
  background: #fff3cd;
  color: #856404;
}
.b-badge-info {
  background: #a8daf9;
  color: #23405a;
}
.b-badge-success {
  background: #cde2ee;
  color: #23405a;
}
.b-badge-secondary {
  background: #e4edf2;
  color: #23405a;
}

.b-button-group .b-button,
.b-button {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a !important;
  border: none;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px #a8daf955;
  border-radius: 2rem;
  padding: 0.5rem 1.2rem;
  margin-right: 0.5rem;
}
.b-button:last-child {
  margin-right: 0;
}
.b-button:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a !important;
  box-shadow: 0 6px 24px #92d2f988;
}

.b-spinner {
  color: #92d2f9 !important;
}

@media (max-width: 700px) {
  .b-card {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
  }
  .b-table {
    font-size: 0.95rem;
  }
}
</style>
