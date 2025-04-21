<template>
  <div class="discussion-card">
    <!-- Header Section -->
    <div class="discussion-header">
      <div class="discussion-badges">
        <span class="badge category">{{ discussion.category }}</span>
        <span v-if="discussion.subcategory" class="badge subcategory">{{ discussion.subcategory }}</span>
      </div>
      <small class="discussion-date">{{ formatDate(discussion.createdAt) }}</small>
    </div>

    <!-- Title -->
    <h3 class="discussion-title">
      <router-link :to="`/discussion/${discussion.id}`" class="title-link">
        {{ discussion.title }}
      </router-link>
    </h3>

    <!-- Author Info -->
    <h6 class="discussion-author">Par {{ discussion.authorName }}</h6>

    <!-- Content Preview -->
    <p class="discussion-content">{{ discussion.content }}</p>

    <!-- Footer Section -->
    <div class="discussion-footer">
      <router-link :to="`/discussion/${discussion.id}`" class="blue-btn view-btn">
        Voir la discussion
      </router-link>
      <small class="response-count">{{ responseCount }} réponse(s)</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiscussionItem',
  props: {
    discussion: {
      type: Object,
      required: true
    },
    responseCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
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
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 1.5rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.discussion-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.discussion-badges .badge {
  background: #e4edf2;
  color: #23405a;
  border-radius: 1rem;
  padding: 0.3rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.discussion-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.title-link {
  text-decoration: none;
  color: #23405a;
  transition: color 0.2s;
}

.title-link:hover {
  color: #92d2f9;
}

.discussion-author {
  font-size: 0.9rem;
  color: #92d2f9;
  margin-bottom: 1rem;
}

.discussion-content {
  font-size: 1rem;
  color: #23405a;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.discussion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blue-btn.view-btn {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.blue-btn.view-btn:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  transform: translateY(-2px);
}

.response-count {
  font-size: 0.9rem;
  color: #92d2f9;
}
</style>
