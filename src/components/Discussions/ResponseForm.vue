<template>
  <div class="response-form-card">
    <form class="response-form" @submit.prevent="submitResponse">
      <textarea
        v-model="content"
        class="response-textarea"
        placeholder="Écrivez votre réponse..."
        required
      ></textarea>
      <button class="blue-btn submit-btn" type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Répondre</span>
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useFirestore } from '@/composables/useFirestore';

export default {
  name: 'ResponseForm',
  props: {
    discussionId: {
      type: String,
      required: true
    }
  },
  emits: ['response-added'],
  setup(props, { emit }) {
    const content = ref('');
    const { currentUser } = useAuth();
    const { addItem, isLoading } = useFirestore('responses');

    const submitResponse = async () => {
      if (!currentUser.value || !content.value.trim()) return;

      const result = await addItem({
        content: content.value.trim(),
        authorId: currentUser.value.uid,
        authorName: currentUser.value.displayName || 'Inconnu',
        discussionId: props.discussionId,
        createdAt: new Date()
      });

      if (result) {
        content.value = '';
        emit('response-added');
      }
    };

    return {
      content,
      isLoading,
      submitResponse
    };
  }
};
</script>

<style scoped>
.response-form-card {
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 1.5rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  margin-bottom: 1.5rem;
}

.response-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.response-textarea {
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  box-shadow: 0 1px 4px #a8daf922;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  outline: none;
  resize: none;
  height: 100px;
  transition: border 0.18s;
}

.response-textarea:focus {
  border-color: #a8daf9;
}

.blue-btn.submit-btn {
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
</style>
