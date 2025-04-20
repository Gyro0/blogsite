<template>
  <b-card class="discussion-card h-100">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <b-badge variant="secondary">
            {{ discussion.category }}
          </b-badge>
          <b-badge v-if="discussion.subcategory" variant="light" class="ml-1">
            {{ discussion.subcategory }}
          </b-badge>
        </div>
        <small class="text-muted">
          {{ formatDate(discussion.createdAt) }}
        </small>
      </div>
    </template>

    <h5 class="card-title">
      <router-link :to="`/discussion/${discussion.id}`" class="text-decoration-none">
        {{ discussion.title }}
      </router-link>
    </h5>
    
    <h6 class="card-subtitle mb-2 text-muted">
      Par {{ discussion.authorName }}
    </h6>
    
    <p class="card-text text-truncate">{{ discussion.content }}</p>
    
    <template #footer>
      <div class="d-flex justify-content-between align-items-center">
        <b-button variant="link" class="p-0" :to="`/discussion/${discussion.id}`">
          Voir la discussion
        </b-button>
        <small class="text-muted">
          {{ responseCount }} réponse(s)
        </small>
      </div>
    </template>
  </b-card>
</template>
  
<script>
export default {
  name: 'DiscussionItem',
  props: {
    // Discussion data object
    discussion: {
      type: Object,
      required: true
    },
    // Number of responses to this discussion
    responseCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // --------------------------------------------------------------
    // Helper Methods
    // --------------------------------------------------------------
    
    // Format timestamp to readable date
    formatDate(timestamp) {
      if (!timestamp) return 'Date inconnue';
      
      const date = timestamp.seconds 
        ? new Date(timestamp.seconds * 1000) 
        : new Date(timestamp);
        
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.discussion-card {
  transition: all 0.2s ease;
  border-radius: 0.5rem;
}

.discussion-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.text-decoration-none {
  text-decoration: none !important;
  color: #212529;
}

.text-decoration-none:hover {
  color: #007bff;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.ml-1 {
  margin-left: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
