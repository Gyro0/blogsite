<template>
  <div>
    <button class="report-btn" @click="showReportModal">
      <i class="bi bi-flag"></i> Signaler
    </button>
    <div v-if="showModal" class="report-modal-backdrop" @click.self="showModal = false">
      <div class="report-modal">
        <div class="report-modal-header">
          <span class="modal-title"><i class="bi bi-flag"></i> Signaler un contenu</span>
          <button class="modal-close" @click="showModal = false" aria-label="Fermer">&times;</button>
        </div>
        <form @submit.prevent="submitReport">
          <div class="form-group">
            <label for="report-reason">Raison du signalement :</label>
            <select id="report-reason" v-model="reportReason" required>
              <option v-for="opt in reportReasons" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="report-details">Détails supplémentaires :</label>
            <textarea id="report-details" v-model="reportDetails" rows="3" placeholder="Précisez votre signalement..."></textarea>
          </div>
          <button class="blue-btn" type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'ReportButton',
  props: {
    contentId: { type: String, required: true },
    contentType: { type: String, required: true, validator: v => ['discussion', 'response'].includes(v) },
    authorId: { type: String, required: true },
    discussionId: { type: String, default: null }
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

    const showReportModal = () => { showModal.value = true; };

    const submitReport = async () => {
      if (!currentUser.value) return;
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
      if (props.contentType === 'response' && props.discussionId) {
        reportData.discussionId = props.discussionId;
      }
      await addItem(reportData);
      alert('Merci pour votre signalement. Un modérateur l\'examinera prochainement.');
      reportReason.value = 'inappropriate';
      reportDetails.value = '';
      showModal.value = false;
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

<style scoped>
.report-btn {
  background: linear-gradient(90deg, #fffbe6 0%, #ffeeba 100%);
  color: #856404;
  border: 1.5px solid #ffeeba;
  border-radius: 2rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  box-shadow: 0 2px 8px #a8daf955;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.report-btn:hover {
  background: linear-gradient(90deg, #ffeeba 0%, #fffbe6 100%);
  color: #a67c00;
  box-shadow: 0 4px 16px #ffeeba88;
}

.report-modal-backdrop {
  position: fixed;
  z-index: 10000;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(205, 226, 238, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-modal {
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 18px;
  box-shadow: 0 2px 24px #a8daf955;
  border: 1.5px solid #bbdcf0;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  min-width: 320px;
  max-width: 95vw;
  color: #23405a;
  position: relative;
  animation: modalPop 0.25s cubic-bezier(.4,2,.6,1) both;
}
@keyframes modalPop {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.report-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}
.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #92d2f9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.modal-close {
  background: none;
  border: none;
  color: #23405a;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.18s;
}
.modal-close:hover {
  opacity: 1;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group label {
  font-weight: 600;
  color: #23405a;
}
.form-group select,
.form-group textarea {
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  box-shadow: 0 1px 4px #a8daf922;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.18s;
  resize: none;
}
.form-group select:focus,
.form-group textarea:focus {
  border-color: #a8daf9;
}

.blue-btn {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a !important;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.7rem 2rem;
  box-shadow: 0 2px 8px #a8daf955;
  transition: background 0.2s, color 0.2s, transform 0.15s;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
}
.blue-btn:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 24px #92d2f988;
}

@media (max-width: 600px) {
  .report-modal {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    border-radius: 1rem;
    min-width: 0;
  }
}
</style>