<template>
  <div>
    <b-form-group label="Trier par:" class="mb-0">
      <b-form-radio-group 
        v-model="selectedOption" 
        :options="options"
        buttons
        button-variant="outline-primary"
        size="sm"
      ></b-form-radio-group>
    </b-form-group>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'SortOptions',
  props: {
    // Currently selected option (v-model)
    modelValue: {
      type: String,
      required: true
    },
    // Available sort options to display
    options: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Local state for selected option
    const selectedOption = ref(props.modelValue);
    
    // --------------------------------------------------------------
    // Side Effects
    // --------------------------------------------------------------
    
    // Update v-model when local selection changes
    watch(selectedOption, (newValue) => {
      emit('update:modelValue', newValue);
    });
    
    // Update local state when prop changes (external v-model updates)
    watch(() => props.modelValue, (newValue) => {
      selectedOption.value = newValue;
    });
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      selectedOption
    };
  }
};
</script>