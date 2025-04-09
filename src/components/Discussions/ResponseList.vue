<template>
    <div>
      <b-list-group>
        <ResponseItem
          v-for="resp in responses"
          :key="resp.id"
          :response="resp"
        />
      </b-list-group>
    </div>
  </template>
  
  <script>
  import ResponseItem from './ResponseItem.vue';
  
  export default {
    name: 'ResponseList',
    props: {
      responses: {
        type: Array,
        default: () => []
      }
    },
    components: {
      ResponseItem
    }
  };
  </script>
  