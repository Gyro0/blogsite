<template>
    <div class="mb-3">
      <b-form-group label="Rechercher des discussions :" label-cols-sm="2" label-align-sm="right">
        <b-input-group>
          <b-form-input v-model="searchTerm" placeholder="Mots-clés..." />
          <b-input-group-append>
            <b-button variant="primary" @click="emitSearch">Rechercher</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    data() {
      return {
        // Track search input value
        searchTerm: ''
      };
    },
    methods: {
      // Emit search event to parent with current search term
      emitSearch() {
        this.$emit('search', this.searchTerm);
      }
    }
  };
  </script>
