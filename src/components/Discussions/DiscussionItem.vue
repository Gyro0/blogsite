<template>
    <b-card
      :title="discussion.title"
      :sub-title="discussion.authorName"
      class="h-100"
    >
      <p>{{ discussion.content }}</p>
      <b-button variant="link" :to="`/discussion/${discussion.id}`">Voir la discussion</b-button>
    </b-card>
  </template>
  
  <script>
  export default {
    name: 'DiscussionItem',
    props: {
      discussion: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  