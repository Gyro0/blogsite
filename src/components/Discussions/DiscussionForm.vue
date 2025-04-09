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
  
      // Expanded categories array to match HomeView
      const categories = [
        "Tech", 
        "News", 
        "Sports", 
        "Arts", 
        "Science", 
        "Health",
        "Politics", 
        "Business", 
        "Education", 
        "Entertainment", 
        "Travel", 
        "Food", 
        "Fashion",
        "Gaming",
        "Music",
        "Books",
        "Movies",
        "DIY",
        "Photography"
      ];
  
      // Form fields
      const title = ref(props.initialData?.title || '');
      const content = ref(props.initialData?.content || '');
      const category = ref(props.initialData?.category || categories[0]);
  
      const handleSubmit = async () => {
        // Create a new discussion
        if (!currentUser.value) return;
        await addItem({
          title: title.value,
          content: content.value,
          category: category.value,
          authorId: currentUser.value.uid,
          authorName: currentUser.value.displayName || 'Inconnu',
          // Other fields if needed
        });
        if (!error.value) {
          // Redirect or inform success
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
