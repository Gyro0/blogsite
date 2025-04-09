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

  // Récupérer un document par ID
  const getItem = async (id) => {
    error.value = null;
    isLoading.value = true;
    try {
      const docRef = db.collection(collectionName).doc(id);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        console.log("Document not found:", id);
        return null;
      }
      
      return { id: docSnap.id, ...docSnap.data() };
    } catch (err) {
      console.error("Error getting document:", err);
      error.value = err.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Supprimer un document
  const deleteItem = async (id) => {
    error.value = null;
    isLoading.value = true;
    try {
      const docRef = db.collection(collectionName).doc(id);
      await docRef.delete();
      return true;
    } catch (err) {
      console.error("Error deleting document:", err);
      error.value = err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Mettre à jour un document
  const updateItem = async (id, data) => {
    error.value = null;
    isLoading.value = true;
    try {
      const docRef = db.collection(collectionName).doc(id);
      await docRef.update(data);
      return true;
    } catch (err) {
      console.error("Error updating document:", err);
      error.value = err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Créer/mettre à jour un document avec un ID spécifique
  const setItem = async (id, data) => {
    error.value = null;
    isLoading.value = true;
    try {
      const docRef = db.collection(collectionName).doc(id);
      await docRef.set({
        ...data,
        updatedAt: new Date()
      });
      return { id, ...data };
    } catch (err) {
      console.error("Error setting document:", err);
      error.value = err.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    error,
    isLoading,
    addItem,
    getAllItems,
    getItem,
    deleteItem,
    updateItem,
    setItem  // Add this line
  };
}
