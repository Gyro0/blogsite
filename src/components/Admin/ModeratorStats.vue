<template>
  <div>
    <div class="row mb-4">
      <div class="col-md-3">
        <b-card bg-variant="primary" text-variant="white" class="text-center">
          <h2>{{ stats.userCount }}</h2>
          <div>Utilisateurs</div>
        </b-card>
      </div>
      <div class="col-md-3">
        <b-card bg-variant="success" text-variant="white" class="text-center">
          <h2>{{ stats.discussionCount }}</h2>
          <div>Discussions</div>
        </b-card>
      </div>
      <div class="col-md-3">
        <b-card bg-variant="info" text-variant="white" class="text-center">
          <h2>{{ stats.responseCount }}</h2>
          <div>Réponses</div>
        </b-card>
      </div>
      <div class="col-md-3">
        <b-card bg-variant="warning" text-variant="white" class="text-center">
          <h2>{{ stats.pendingReportCount }}</h2>
          <div>Signalements en attente</div>
        </b-card>
      </div>
    </div>
    
    <b-card title="Activité récente">
      <b-list-group>
        <b-list-group-item v-for="activity in recentActivity" :key="activity.id">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ activity.type }}</strong>: {{ activity.description }}
            </div>
            <small>{{ formatDate(activity.date) }}</small>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';

export default {
  name: 'ModeratorStats',
  setup() {
    const stats = ref({
      userCount: 0,
      discussionCount: 0,
      responseCount: 0,
      pendingReportCount: 0
    });
    
    const recentActivity = ref([]);
    
    const loadStats = async () => {
      // Load user count
      const { getAllItems: getUsers } = useFirestore('users');
      const users = await getUsers();
      stats.value.userCount = users.length;
      
      // Load discussion count
      const { getAllItems: getDiscussions } = useFirestore('discussions');
      const discussions = await getDiscussions();
      stats.value.discussionCount = discussions.length;
      
      // Load response count
      const { getAllItems: getResponses } = useFirestore('responses');
      const responses = await getResponses();
      stats.value.responseCount = responses.length;
      
      // Load pending report count
      const { getAllItems: getReports } = useFirestore('reports');
      const pendingReports = await getReports({ field: 'status', value: 'pending' });
      stats.value.pendingReportCount = pendingReports.length;
      
      // Load recent activity (combine recent discussions, responses, reports)
      const allActivity = [
        ...discussions.map(d => ({ 
          id: `disc-${d.id}`, 
          type: 'Discussion', 
          description: d.title, 
          date: d.createdAt
        })),
        ...responses.map(r => ({ 
          id: `resp-${r.id}`, 
          type: 'Réponse', 
          description: r.content.substr(0, 50) + (r.content.length > 50 ? '...' : ''), 
          date: r.createdAt
        })),
        ...pendingReports.map(r => ({ 
          id: `report-${r.id}`, 
          type: 'Signalement', 
          description: `${formatReason(r.reason)}`, 
          date: r.createdAt
        }))
      ];
      
      // Sort by date and take the 10 most recent
      recentActivity.value = allActivity
        .sort((a, b) => b.date?.seconds - a.date?.seconds)
        .slice(0, 10);
    };
    
    const formatDate = (firebaseTimestamp) => {
      if (!firebaseTimestamp) return 'Date inconnue';
      const date = new Date(firebaseTimestamp.seconds * 1000);
      return date.toLocaleString();
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
    
    onMounted(loadStats);
    
    return {
      stats,
      recentActivity,
      formatDate
    };
  }
};
</script>