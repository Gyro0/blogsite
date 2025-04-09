<template>
    <div>
      <b-row>
        <b-col v-for="disc in discussions" :key="disc.id" cols="12" md="6" class="mb-3">
          <DiscussionItem :discussion="disc" />
        </b-col>
      </b-row>
    </div>
  </template>
  
  <script>
  import DiscussionItem from './DiscussionItem.vue';
  
  export default {
    name: 'DiscussionList',
    props: {
      discussions: {
        type: Array,
        default: () => []
      }
    },
    components: {
      DiscussionItem
    }
  };
  </script>
  