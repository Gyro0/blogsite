<template>
  <div class="category-card">
    <h5 class="mb-3">Catégories</h5>
    <div class="category-grid">
      <button
        :class="['category-button', { active: modelValue === 'All' }]"
        @click="quickSelect('All')"
      >
        Toutes
      </button>
      <button
        v-for="category in categories.filter(c => c !== 'All')"
        :key="category"
        :class="['category-button', { active: modelValue === category }]"
        @click="quickSelect(category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'CategoryFilter',
  props: {
    categories: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      default: 'All'
    }
  },
  emits: ['filter', 'update:modelValue'],
  setup(props, { emit }) {
    const selectedCategory = ref(props.modelValue);

    watch(() => props.modelValue, (newValue) => {
      selectedCategory.value = newValue;
    });

    const quickSelect = (category) => {
      selectedCategory.value = category;
      emit('filter', category);
      emit('update:modelValue', category);
    };

    return {
      selectedCategory,
      quickSelect
    };
  }
};
</script>

<style scoped>
.category-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 2rem 1.5rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
}

h5 {
  color: #23405a;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: -0.5px;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.category-button {
  background: #e4edf2;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  border-radius: 1.2rem;
  padding: 0.45rem 1.2rem;
  font-size: 0.97rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 4px #a8daf922;
  outline: none;
}
.category-button.active,
.category-button:hover {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  border-color: #92d2f9;
  box-shadow: 0 4px 16px #92d2f988;
}

@media (max-width: 600px) {
  .category-card {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
  }
  .category-grid {
    gap: 0.4rem;
  }
  .category-button {
    font-size: 0.93rem;
    padding: 0.35rem 0.8rem;
  }
}
</style>
