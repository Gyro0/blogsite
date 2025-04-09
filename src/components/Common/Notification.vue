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
      const { notifications, removeNotification } = useNotifications();
  
      const remove = (id) => {
        removeNotification(id);
      };
  
      // Convertit le type (success, error...) en variant bootstrap (success, danger, etc.)
      const variant = (type) => {
        if (type === 'error') return 'danger';
        return type || 'primary';
      };
  
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
  