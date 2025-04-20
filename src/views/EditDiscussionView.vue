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