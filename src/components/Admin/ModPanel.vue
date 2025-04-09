<template>
  <b-card title="Panneau de Modération">
    <b-tabs content-class="mt-3">
      <b-tab title="Utilisateurs" active>
        <UserManagement />
      </b-tab>
      <b-tab title="Statistiques">
        <ModeratorStats />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { onMounted } from 'vue';
import UserManagement from './UserManagement.vue';
import ModeratorStats from './ModeratorStats.vue';
import { useModerator } from '@/composables/useModerator';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'ModPanel',
  components: {
    UserManagement,
    ModeratorStats
  },
  setup() {
    const { checkModerator } = useModerator();
    const { forceTokenRefresh } = useAuth();
    
    onMounted(async () => {
      await forceTokenRefresh();
      checkModerator();
    });
    
    return {};
  }
};
</script>
