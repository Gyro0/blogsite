<template>
  <div class="notification-container">
    <transition-group name="fade" tag="div">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="['notif-alert', notif.type || 'primary']"
        @click="remove(notif.id)"
        tabindex="0"
        role="alert"
      >
        <span class="notif-message">{{ notif.message }}</span>
        <button class="notif-close" @click.stop="remove(notif.id)" aria-label="Fermer">&times;</button>
      </div>
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
    const remove = (id) => removeNotification(id);
    return { notifications, remove };
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 260px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s, transform .5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.notif-alert {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #e4edf2 70%, #a8daf9 100%);
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px #a8daf955;
  padding: 1rem 2.5rem 1rem 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1rem;
  min-width: 240px;
  max-width: 340px;
  cursor: pointer;
  position: relative;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.notif-alert.success {
  background: linear-gradient(90deg, #cde2ee 70%, #a8daf9 100%);
  border-color: #92d2f9;
}
.notif-alert.danger, .notif-alert.error {
  background: linear-gradient(90deg, #ffb3b3 70%, #ffe4e4 100%);
  color: #a94442;
  border-color: #ffb3b3;
}
.notif-alert.warning {
  background: linear-gradient(90deg, #fff3cd 70%, #ffeeba 100%);
  color: #856404;
  border-color: #ffeeba;
}
.notif-alert.info {
  background: linear-gradient(90deg, #a8daf9 70%, #cde2ee 100%);
  color: #23405a;
  border-color: #a8daf9;
}

.notif-message {
  flex: 1;
  padding-right: 1.2rem;
}

.notif-close {
  background: none;
  border: none;
  color: #23405a;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  position: absolute;
  top: 0.7rem;
  right: 1.1rem;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.18s;
}
.notif-close:hover {
  opacity: 1;
}

@media (max-width: 600px) {
  .notification-container {
    top: 0.5rem;
    right: 0.5rem;
    min-width: 180px;
  }
  .notif-alert {
    font-size: 0.97rem;
    padding: 0.7rem 1.5rem 0.7rem 0.7rem;
    min-width: 120px;
    max-width: 98vw;
  }
}
</style>
