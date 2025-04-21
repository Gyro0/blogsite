<template>
  <div class="discussion-form-card">
    <h2 class="form-title">{{ isEditing ? 'Modifier la Discussion' : 'Créer une Discussion' }}</h2>
    <form class="discussion-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Titre</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Entrez le titre de la discussion"
          required
        />
      </div>
      <div class="form-group">
        <label for="content">Contenu</label>
        <textarea
          id="content"
          v-model="content"
          rows="5"
          placeholder="Entrez le contenu de la discussion"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="category">Catégorie</label>
        <select id="category" v-model="category" required>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <button class="blue-btn submit-btn" type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>{{ isEditing ? 'Mettre à jour' : 'Publier' }}</span>
      </button>
      <div v-if="error" class="blue-alert error-alert">{{ error }}</div>
    </form>
  </div>
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
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { currentUser } = useAuth();
    const { addItem, updateItem, error, isLoading } = useFirestore('discussions');

    const categories = [
      'Tech', 'News', 'Sports', 'Arts', 'Science', 'Health', 'Politics',
      'Business', 'Education', 'Entertainment', 'Travel', 'Food', 'Fashion',
      'Gaming', 'Music', 'Books', 'Movies', 'DIY', 'Photography'
    ];

    const title = ref(props.initialData?.title || '');
    const content = ref(props.initialData?.content || '');
    const category = ref(props.initialData?.category || categories[0]);

    const handleSubmit = async () => {
      if (!title.value.trim() || !content.value.trim() || !category.value) return;
      if (!currentUser.value) return;

      const discussionData = {
        title: title.value.trim(),
        content: content.value.trim(),
        category: category.value,
        authorId: currentUser.value.uid,
        authorName: currentUser.value.displayName || 'Inconnu'
      };

      if (props.isEditing && props.initialData?.id) {
        await updateItem(props.initialData.id, {
          ...discussionData,
          updatedAt: new Date()
        });
      } else {
        await addItem(discussionData);
      }

      if (!error.value) {
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

<style scoped>
.discussion-form-card {
  max-width: 600px;
  margin: 2rem auto;
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #92d2f9;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 8px #a8daf955;
}

.discussion-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 600;
  color: #23405a;
}

.form-group input,
.form-group textarea,
.form-group select {
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  box-shadow: 0 1px 4px #a8daf922;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.18s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #a8daf9;
}

.blue-btn.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a !important;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.7rem 2rem;
  box-shadow: 0 2px 8px #a8daf955;
  transition: background 0.2s, color 0.2s, transform 0.15s;
  font-size: 1.1rem;
}

.blue-btn.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.blue-btn.submit-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 24px #92d2f988;
}

.loader {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border: 2.5px solid #a8daf9;
  border-top: 2.5px solid #92d2f9;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.blue-alert {
  background: #e4edf2;
  color: #23405a;
  border: 1.5px solid #a8daf9;
  border-radius: 1rem;
  font-weight: 500;
  padding: 1rem 1.5rem;
  text-align: center;
}

.error-alert {
  border-color: #ffb3b3;
  background: #fff;
  color: #a94442;
}
</style>
