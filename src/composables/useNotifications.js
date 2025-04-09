/*
  useNotifications.js
  -------------------
  Gère l'affichage des notifications ou alertes dans l'application
  (erreurs, succès, etc.).
*/

import { ref } from 'vue';

const notifications = ref([]); // On stocke toutes les notifications

export function useNotifications() {
  const addNotification = (type, message) => {
    // type: "success", "error", "warning", etc.
    notifications.value.push({ type, message, id: Date.now() });
  };

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter((notif) => notif.id !== id);
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
}
