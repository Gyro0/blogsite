<template>
    <div>
      <transition-group name="fade" tag="div">
        <b-alert
          v-for="notif in notifications"
          :key="notif.id"
          :variant="variant(notif.type)"
          dismissible
          @dismissed="remove(notif.id)"
          class="mt-2"
        >
          {{ notif.message }}
        </b-alert>
      </transition-group>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useNotifications } from '@/composables/useNotifications';
  
  export default {
    name: 'Notification',
    setup() {
      // --------------------------------------------------------------
      // State Management
      // --------------------------------------------------------------
      
      // Get notifications from global store
      const { notifications, removeNotification } = useNotifications();
      
      // --------------------------------------------------------------
      // User Interactions
      // --------------------------------------------------------------
      
      // Remove a notification by ID
      const remove = (id) => {
        removeNotification(id);
      };
      
      // --------------------------------------------------------------
      // Helper Functions
      // --------------------------------------------------------------
      
      // Convert notification type to Bootstrap variant
      const variant = (type) => {
        // 'error' maps to 'danger' in Bootstrap
        if (type === 'error') return 'danger';
        
        // Use the type as variant or default to 'primary'
        return type || 'primary';
      };
      
      // --------------------------------------------------------------
      // Expose component API
      // --------------------------------------------------------------
      return {
        notifications,
        remove,
        variant
      };
    }
  };
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
