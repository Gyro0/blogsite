/*
  useFirestore.js
  --------------
  Composable pour interagir avec Firestore : créer, lire, mettre à jour, supprimer
  des documents dans des collections spécifiques.
*/

import { ref } from 'vue';
import { db } from '@/firebase/firebaseInit';

export function useFirestore(collectionName) {
  const error = ref(null);
  const isLoading = ref(false);

  // Ajout d'un document
  const addItem = async (data) => {
    error.value = null;
    isLoading.value = true;
    try {
      const res = await db.collection(collectionName).add({
        ...data,
        createdAt: new Date()
      });
      return res;
    } catch (err) {
      console.error("Error adding document:", err);
      error.value = err.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Récupérer tous les documents (avec options de filtrage/tri)
  const getAllItems = async (filters = {}, sortByDate = false) => {
    error.value = null;
    isLoading.value = true;
    try {
      let ref = db.collection(collectionName);

      // Filtrage : filters = { field: "category", value: "xxx" }
      if (filters.field && filters.value) {
        ref = ref.where(filters.field, "==", filters.value);
      }

      // Tri par date si nécessaire
      if (sortByDate) {
        ref = ref.orderBy("createdAt", "desc");
      }

      const snapshot = await ref.get();
      const results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
    } catch (err) {
      console.error("Error getting documents:", err);
      error.value = err.message;
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Other functions in Firebase v8 syntax...

  return {
    error,
    isLoading,
    addItem,
    getAllItems
    // Include other functions
  };
}
