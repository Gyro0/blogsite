<template>
  <div class="container mt-4">
    <h2>Modifier la discussion</h2>
    <div v-if="isLoading" class="text-center">
      <b-spinner label="Chargement..."></b-spinner>
    </div>
    <div v-else-if="!discussion" class="alert alert-danger">
      Discussion non trouvée ou vous n'avez pas l'autorisation de la modifier.
    </div>
    <DiscussionForm v-else :initialData="discussion" :isEditing="true" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFirestore } from '@/composables/useFirestore';
import { useAuth } from '@/composables/useAuth';
import DiscussionForm from '@/components/Discussions/DiscussionForm.vue';

export default {
  name: 'EditDiscussionView',
  components: {
    DiscussionForm
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const discussionId = route.params.id;
    const discussion = ref(null);
    const isLoading = ref(true);
    const { currentUser } = useAuth();
    const { getItem } = useFirestore('discussions');

    const loadDiscussion = async () => {
      isLoading.value = true;
      const data = await getItem(discussionId);
      
      // Verify user is the author of this discussion
      if (data && currentUser.value && data.authorId === currentUser.value.uid) {
        discussion.value = {...data, id: discussionId};
      } else {
        router.push('/');
      }
      isLoading.value = false;
    };

    onMounted(loadDiscussion);

    return {
      discussion,
      isLoading
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 3rem auto 0 auto;
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 18px;
  box-shadow: 0 2px 16px #a8daf955;
  padding: 2.5rem 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
}

h2 {
  color: #23405a;
  font-weight: 800;
  letter-spacing: -1px;
  text-shadow: 0 2px 8px #a8daf955;
  margin-bottom: 2rem;
}

.alert-danger {
  background: #bbdcf0;
  color: #23405a;
  border: 1px solid #a8daf9;
}

.b-spinner {
  color: #92d2f9 !important;
}

@media (max-width: 600px) {
  .container {
    padding: 1.2rem 0.5rem;
    margin-top: 1.5rem;
  }
}
</style>