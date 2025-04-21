<template>
  <div class="discussions-list">
    <div v-if="discussions.length > 0" class="discussion-items">
      <DiscussionItem
        v-for="disc in discussions"
        :key="disc.id"
        :discussion="disc"
        :responseCount="responseCount[disc.id] || 0"
      />
    </div>
    <div v-else class="no-discussions">
      <p>Aucune discussion trouvée.</p>
    </div>
  </div>
</template>

<script>
import DiscussionItem from './DiscussionItem.vue';

export default {
  name: 'DiscussionList',
  components: {
    DiscussionItem
  },
  props: {
    discussions: {
      type: Array,
      default: () => []
    },
    responseCount: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
.discussions-list {
  width: 100%;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.discussion-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-discussions {
  text-align: center;
  color: #23405a;
  font-size: 1.2rem;
  font-weight: 600;
  background: #e4edf2;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1.5px solid #bbdcf0;
  box-shadow: 0 2px 24px #a8daf955;
}
</style>
