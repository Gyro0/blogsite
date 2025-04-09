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
      console.log("No current user");
      isModerator.value = false;
      return;
    }

    console.log("Checking mod status for:", currentUser.value.uid);
    
    // Aller chercher le doc user correspondant
    const { getItem, error } = useFirestore('users');
    const userData = await getItem(currentUser.value.uid);
    
    console.log("User data:", userData);
    
    if (!userData || error.value) {
      console.log("Error or no user data:", error.value);
      isModerator.value = false;
      return;
    }

    console.log("User role:", userData.role);
    
    // This is how the admin check works
    isModerator.value = userData.role === 'moderator' || userData.role === 'admin';
    console.log("Is moderator:", isModerator.value);
  };

  // Méthode pour supprimer un message (ex. discussion, réponse) si on est modérateur
  const removeMessage = async (collectionName, id) => {
    if (!currentUser.value) {
      console.log("No current user for moderation");
      return false;
    }
    
    // Re-verify mod status before performing critical operations
    await checkModerator();
    
    if (!isModerator.value) {
      console.log("User is not a moderator:", currentUser.value.uid);
      return false;
    }
    
    try {
      console.log(`Moderator ${currentUser.value.uid} is deleting ${collectionName}/${id}`);
      const { deleteItem } = useFirestore(collectionName);
      const result = await deleteItem(id);
      
      if (result) {
        console.log(`Successfully deleted ${collectionName}/${id}`);
        return true;
      } else {
        console.log(`Failed to delete ${collectionName}/${id}`);
        return false;
      }
    } catch (error) {
      console.error(`Error in removeMessage for ${collectionName}/${id}:`, error);
      return false;
    }
  };

  return {
    isModerator,
    checkModerator,
    removeMessage
  };
}
