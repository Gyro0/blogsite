<template>
  <div class="mb-4">
    <h5 class="filter-title">Filtrer par catégorie</h5>
    
    <div class="category-buttons-container">
      <!-- "All Categories" button -->
      <b-button
        :variant="selectedCategory === 'All' ? 'primary' : 'outline-secondary'"
        @click="quickSelect('All')"
        class="category-button mb-2 mr-2"
      >
        Toutes les catégories
      </b-button>
      
      <!-- Individual category buttons -->
      <b-button
        v-for="category in categories.filter(c => c !== 'All')"
        :key="category"
        :variant="selectedCategory === category ? 'primary' : 'info'"
        @click="quickSelect(category)"
        class="category-button mb-2 mr-2"
      >
        {{ category }}
      </b-button>
    </div>
    
    <!-- Show currently selected filter -->
    <div v-if="selectedCategory !== 'All'" class="selected-filter mt-2">
      <small>
        Filtre actif: <b-badge>{{ selectedCategory }}</b-badge>
        <b-button size="sm" variant="link" @click="resetFilter">
          <i class="bi bi-x-circle"></i> Effacer
        </b-button>
      </small>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'CategoryFilter',
  props: {
    categories: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: 'All'
    }
  },
  emits: ['filter', 'update:value'],
  setup(props, { emit }) {
    const selectedCategory = ref(props.value);
    
    // Watch for external changes to value
    watch(() => props.value, (newValue) => {
      selectedCategory.value = newValue;
    });
    
    const emitFilter = () => {
      emit('filter', selectedCategory.value);
      emit('update:value', selectedCategory.value);
    };
    
    const resetFilter = () => {
      selectedCategory.value = 'All';
      emitFilter();
    };
    
    const quickSelect = (category) => {
      selectedCategory.value = category;
      emitFilter();
    };
    
    const getCategoryVariant = (category) => {
      const variants = {
        'Tech': 'info',
        'News': 'primary',
        'Sports': 'success',
        'Arts': 'warning',
        'Science': 'dark',
        'Health': 'danger',
        'Politics': 'secondary',
        'Business': 'light',
        'Education': 'info',
        'Entertainment': 'warning',
        'Travel': 'success',
        'Food': 'danger',
        'Fashion': 'primary',
        'Gaming': 'info',
        'Music': 'warning',
        'Books': 'dark',
        'Movies': 'danger',
        'DIY': 'success',
        'Photography': 'primary'
      };
      
      return variants[category] || 'outline-secondary';
    };
    
    return {
      selectedCategory,
      emitFilter,
      resetFilter,
      quickSelect,
      getCategoryVariant
    };
  }
};
</script>

<style scoped>
.filter-title {
  margin-bottom: 1rem;
  color: #495057;
}

.category-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-button {
  font-size: 0.9rem;
  transition: all 0.2s;
}

.category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.selected-filter {
  color: #6c757d;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
