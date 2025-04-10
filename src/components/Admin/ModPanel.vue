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
  
  // Register child components for tabs
  components: {
    UserManagement, // User management tab
    ModeratorStats  // Statistics tab
  },
  
  setup() {
    // Get moderator utilities from composable
    const { checkModerator } = useModerator();
    
    // Get auth utilities for token refresh
    const { forceTokenRefresh } = useAuth();
    
    // --------------------------------------------------------------
    // Lifecycle Hooks
    // --------------------------------------------------------------
    
    // Verify moderator permissions when component mounts
    onMounted(async () => {
      // Refresh auth token to ensure up-to-date permissions
      await forceTokenRefresh();
      
      // Check if current user has moderator privileges
      checkModerator();
    });
    
    // No values returned as this component only serves as a container
    return {};
  }
};
</script>
