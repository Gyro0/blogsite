<template>
  <div>
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ stats.userCount }}</div>
        <div class="stat-label">Utilisateurs</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.discussionCount }}</div>
        <div class="stat-label">Discussions</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.responseCount }}</div>
        <div class="stat-label">Réponses</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.pendingReportCount }}</div>
        <div class="stat-label">Signalements en attente</div>
      </div>
    </div>

    <div class="activity-card">
      <h3>Activité récente</h3>
      <ul class="activity-list">
        <li v-for="activity in recentActivity" :key="activity.id" class="activity-item">
          <div class="activity-type">{{ activity.type }}</div>
          <div class="activity-desc">{{ activity.description }}</div>
          <div class="activity-date">{{ formatDate(activity.date) }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';

const stats = ref({
  userCount: 0,
  discussionCount: 0,
  responseCount: 0,
  pendingReportCount: 0
});
const recentActivity = ref([]);

const loadStats = async () => {
  const { getAllItems: getUsers } = useFirestore('users');
  const users = await getUsers();
  stats.value.userCount = users.length;

  const { getAllItems: getDiscussions } = useFirestore('discussions');
  const discussions = await getDiscussions();
  stats.value.discussionCount = discussions.length;

  const { getAllItems: getResponses } = useFirestore('responses');
  const responses = await getResponses();
  stats.value.responseCount = responses.length;

  const { getAllItems: getReports } = useFirestore('reports');
  const pendingReports = await getReports({ field: 'status', value: 'pending' });
  stats.value.pendingReportCount = pendingReports.length;

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
      description: formatReason(r.reason),
      date: r.createdAt
    }))
  ];
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
</script>

<style scoped>
.stats-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  justify-content: space-between;
}
.stat-card {
  flex: 1 1 180px;
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #a8daf955;
  border: 1.5px solid #bbdcf0;
  text-align: center;
  padding: 1.5rem 0.5rem;
  color: #23405a;
  margin: 0.5rem 0;
  min-width: 150px;
}
.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #92d2f9;
  margin-bottom: 0.3rem;
  text-shadow: 0 2px 8px #a8daf955;
}
.stat-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #23405a;
  opacity: 0.85;
}

.activity-card {
  background: linear-gradient(120deg, #fff 60%, #cde2ee 100%);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #a8daf955;
  border: 1.5px solid #bbdcf0;
  padding: 1.5rem 1rem;
  margin-top: 2rem;
}
.activity-card h3 {
  color: #23405a;
  font-weight: 800;
  margin-bottom: 1.2rem;
  letter-spacing: -1px;
  text-shadow: 0 2px 8px #a8daf955;
}
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.activity-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #bbdcf0;
  padding: 0.7rem 0;
  font-size: 1rem;
}
.activity-type {
  font-weight: 700;
  color: #a8daf9;
  margin-right: 1rem;
}
.activity-desc {
  flex: 1 1 200px;
  color: #23405a;
  margin-right: 1rem;
}
.activity-date {
  font-size: 0.95rem;
  color: #92d2f9;
  min-width: 120px;
  text-align: right;
}
@media (max-width: 900px) {
  .stats-row {
    flex-direction: column;
    gap: 1rem;
  }
  .stat-card {
    min-width: 0;
  }
}
</style>