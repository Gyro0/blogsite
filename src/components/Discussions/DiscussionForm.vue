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
      // Initial data for edit mode
      initialData: {
        type: Object,
        default: null
      },
      // Flag to indicate if we're editing an existing discussion
      isEditing: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      // --------------------------------------------------------------
      // State Management
      // --------------------------------------------------------------
      
      // Get current user
      const { currentUser } = useAuth();
      
      // Get Firestore utilities for discussions collection
      const { addItem, updateItem, error, isLoading } = useFirestore('discussions');
      
      // --------------------------------------------------------------
      // Categories
      // --------------------------------------------------------------
      
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
      
      // --------------------------------------------------------------
      // Form data
      // --------------------------------------------------------------
    
      // Form fields initialized from props (for edit mode) or empty (for create mode)
      const title = ref(props.initialData?.title || '');
      const content = ref(props.initialData?.content || '');
      const category = ref(props.initialData?.category || categories[0]);
      
      // --------------------------------------------------------------
      // Form Submission
      // --------------------------------------------------------------
    
      const handleSubmit = async () => {
        // Validate required fields
        if (!title.value.trim() || !content.value.trim() || !category.value) {
          return;
        }
        
        if (!currentUser.value) return;
        
        // Prepare discussion data
        const discussionData = {
          title: title.value.trim(),
          content: content.value.trim(),
          category: category.value,
          authorId: currentUser.value.uid,
          authorName: currentUser.value.displayName || 'Inconnu'
        };
        
        if (props.isEditing && props.initialData?.id) {
          // Update existing discussion
          await updateItem(props.initialData.id, {
            ...discussionData,
            updatedAt: new Date()
          });
        } else {
          // Create new discussion
          await addItem(discussionData);
        }
        
        if (!error.value) {
          // Redirect on success
          window.location.href = '/';
        }
      };
      
      // --------------------------------------------------------------
      // Expose component API
      // --------------------------------------------------------------
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
