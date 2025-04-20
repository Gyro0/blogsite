/**
 * Gère la logique liée à la modération
 */
import { ref } from 'vue';
import { useAuth } from './useAuth';
import { useFirestore } from './useFirestore';

export function useModerator() {
  const { currentUser } = useAuth();
  const isModerator = ref(false);

  const checkModerator = async () => {
    if (!currentUser.value) {
      isModerator.value = false;
      return;
    }
    
    const { getItem } = useFirestore('users');
    const userData = await getItem(currentUser.value.uid);
    
    if (!userData) {
      isModerator.value = false;
      return;
    }
    
    isModerator.value = userData.role === 'moderator' || userData.role === 'admin';
  };

  const removeMessage = async (collectionName, id) => {
    if (!currentUser.value) return false;
    
    await checkModerator();
    
    if (!isModerator.value) return false;
    
    const { deleteItem } = useFirestore(collectionName);
    const result = await deleteItem(id);
    
    return !!result;
  };

  return {
    isModerator,
    checkModerator,
    removeMessage
  };
}
