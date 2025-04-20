<template>
  <b-card>
    <h5 class="mb-3">Catégories</h5>
    
    <div class="category-grid">
      <!-- "All Categories" button -->
      <b-button
        :variant="modelValue === 'All' ? 'secondary' : 'outline-secondary'"
        @click="quickSelect('All')"
        class="category-button"
      >
        Toutes
      </b-button>
      
      <!-- Individual category buttons -->
      <b-button
        v-for="category in categories.filter(c => c !== 'All')"
        :key="category"
        :variant="modelValue === category ? 'secondary' : 'outline-secondary'"
        @click="quickSelect(category)"
        class="category-button"
      >
        {{ category }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'CategoryFilter',
  props: {
    // Array of available categories to display
    categories: {
      type: Array,
      required: true
    },
    // Currently selected category (v-model binding)
    modelValue: {
      type: String,
      default: 'All'
    }
  },
  emits: ['filter', 'update:modelValue'],
  setup(props, { emit }) {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Local state for selected category
    const selectedCategory = ref(props.modelValue);
    
    // --------------------------------------------------------------
    // Side Effects
    // --------------------------------------------------------------
    
    // Update local state when prop changes (external v-model updates)
    watch(() => props.modelValue, (newValue) => {
      selectedCategory.value = newValue;
    });
    
    // --------------------------------------------------------------
    // User Interactions
    // --------------------------------------------------------------
    
    // Handle category selection
    const quickSelect = (category) => {
      // Update local state
      selectedCategory.value = category;
      
      // Emit filter event for parent component
      emit('filter', category);
      
      // Update v-model value
      emit('update:modelValue', category);
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      selectedCategory,
      quickSelect
    };
  }
};
</script>

<style scoped>
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-button {
  margin-bottom: 0.5rem;
  flex-grow: 0;
  font-size: 0.9rem;
}
</style>
