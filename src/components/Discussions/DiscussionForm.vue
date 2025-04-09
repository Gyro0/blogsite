<template>
    <b-card title="Créer/Modifier une Discussion">
      <b-form @submit.prevent="handleSubmit">
        <b-form-group label="Titre" label-for="title">
          <b-form-input id="title" v-model="title" required />
        </b-form-group>
  
        <b-form-group label="Contenu" label-for="content">
          <b-form-textarea id="content" v-model="content" rows="5" required />
        </b-form-group>
  
        <b-form-group label="Catégorie" label-for="category">
          <b-form-select id="category" v-model="category" :options="categories" required />
        </b-form-group>
  
        <b-button type="submit" variant="primary" class="mt-2" :disabled="isLoading">Publier</b-button>
      </b-form>
  
      <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
    </b-card>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import { useFirestore } from '@/composables/useFirestore';
  
  export default {
    name: 'DiscussionForm',
    props: {
      initialData: {
        type: Object,
        default: null
      }
    },
    setup(props) {
      const { currentUser } = useAuth();
      const { addItem, error, isLoading } = useFirestore('discussions');
  
      const categories = ["Tech", "News", "Sports", "Arts"];
  
      // Champs du formulaire
      const title = ref(props.initialData?.title || '');
      const content = ref(props.initialData?.content || '');
      const category = ref(props.initialData?.category || categories[0]);
  
      const handleSubmit = async () => {
        // Création d'une nouvelle discussion
        if (!currentUser.value) return;
        await addItem({
          title: title.value,
          content: content.value,
          category: category.value,
          authorId: currentUser.value.uid,
          authorName: currentUser.value.displayName || 'Inconnu',
          // d'autres champs si besoin
        });
        if (!error.value) {
          // Rediriger ou informer du succès
          window.location.href = '/';
        }
      };
  
      return {
        title,
        content,
        category,
        categories,
        error,
        isLoading,
        handleSubmit
      };
    }
  };
  </script>
  