<template>
  <div class="mod-panel-card">
    <div class="mod-panel-title">Panneau de Modération</div>
    <div class="mod-tabs">
      <button
        class="mod-tab"
        :class="{ active: activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        Utilisateurs
      </button>
      <button
        class="mod-tab"
        :class="{ active: activeTab === 'stats' }"
        @click="activeTab = 'stats'"
      >
        Statistiques
      </button>
    </div>
    <div class="mod-tab-content">
      <UserManagement v-if="activeTab === 'users'" />
      <ModeratorStats v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserManagement from './UserManagement.vue';
import ModeratorStats from './ModeratorStats.vue';
import { useModerator } from '@/composables/useModerator';
import { useAuth } from '@/composables/useAuth';

const activeTab = ref('users');
const { checkModerator } = useModerator();
const { forceTokenRefresh } = useAuth();

onMounted(async () => {
  await forceTokenRefresh();
  checkModerator();
});
</script>

<style scoped>
.mod-panel-card {
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 18px;
  box-shadow: 0 2px 16px #a8daf955;
  padding: 2.5rem 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  max-width: 700px;
  margin: 3rem auto 0 auto;
}
.mod-panel-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 1.5rem;
  color: #23405a;
  text-shadow: 0 2px 8px #a8daf955;
  text-align: center;
}
.mod-tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}
.mod-tab {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.6rem 2rem;
  box-shadow: 0 2px 8px #a8daf955;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.15s;
  font-size: 1rem;
}
.mod-tab.active,
.mod-tab:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a;
  box-shadow: 0 6px 24px #92d2f988;
}
.mod-tab-content {
  margin-top: 1.5rem;
}
@media (max-width: 600px) {
  .mod-panel-card {
    padding: 1.2rem 0.5rem;
    margin-top: 1.5rem;
  }
  .mod-tabs {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
