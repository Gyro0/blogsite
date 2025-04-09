/*
  useModerator.js
  --------------
  Gère la logique liée à la modération :
  - Vérifier si un utilisateur est modérateur
  - Gérer la suppression de contenus inappropriés, etc.
*/

import { ref } from 'vue';
import { useAuth } from './useAuth';
import { useFirestore } from './useFirestore';

export function useModerator() {
  const { currentUser } = useAuth();

  // Suppose qu'on stocke un champ 'role' = 'user' ou 'moderator' ou 'admin' dans la collection "users"
  const isModerator = ref(false);

  const checkModerator = async () => {
    if (!currentUser.value) {
      isModerator.value = false;
      return;
    }

    // Aller chercher le doc user correspondant
    const { getItem, error } = useFirestore('users');
    const userData = await getItem(currentUser.value.uid);
    if (error.value) {
      isModerator.value = false;
      return;
    }

    // On vérifie le rôle
    isModerator.value = userData.role === 'moderator' || userData.role === 'admin';
  };

  // Méthode pour supprimer un message (ex. discussion, réponse) si on est modérateur
  const removeMessage = async (collectionName, id) => {
    if (!isModerator.value) return;
    const { deleteItem } = useFirestore(collectionName);
    await deleteItem(id);
  };

  return {
    isModerator,
    checkModerator,
    removeMessage
  };
}
