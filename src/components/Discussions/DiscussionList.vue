<template>
  <div class="discussions-list">
    <div v-for="disc in discussions" :key="disc.id" class="mb-3">
      <DiscussionItem 
        :discussion="disc" 
        :responseCount="responseCount[disc.id] || 0"
      />
    </div>
  </div>
</template>

<script>
import DiscussionItem from './DiscussionItem.vue';

export default {
  name: 'DiscussionList',
  components: {
    DiscussionItem // Child component for individual discussions
  },
  props: {
    // Array of discussion data objects
    discussions: {
      type: Array,
      default: () => []
    },
    // Map of discussion IDs to response counts
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
}
</style>
