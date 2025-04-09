<template>
    <div class="mb-3">
      <b-form-group label="Filtrer par catégorie :" label-cols-sm="2" label-align-sm="right">
        <b-form-select v-model="selectedCategory" :options="categories" @change="emitFilter" />
      </b-form-group>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CategoryFilter',
    props: {
      categories: {
        type: Array,
        default: () => ["All", "Tech", "News", "Sports", "Arts"]
      },
      defaultCategory: {
        type: String,
        default: "All"
      }
    },
    data() {
      return {
        selectedCategory: this.defaultCategory
      };
    },
    methods: {
      emitFilter() {
        this.$emit('filter', this.selectedCategory);
      }
    }
  };
  </script>
  