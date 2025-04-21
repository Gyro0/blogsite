<template>
  <div class="sort-options">
    <label class="sort-label">Trier par :</label>
    <div class="sort-radio-group">
      <button
        v-for="opt in options"
        :key="opt.value || opt"
        :class="['sort-radio-btn', { active: selectedOption === (opt.value || opt) }]"
        @click="select(opt.value || opt)"
        type="button"
      >
        {{ opt.text || opt }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'SortOptions',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedOption = ref(props.modelValue);

    watch(selectedOption, (newValue) => {
      emit('update:modelValue', newValue);
    });
    watch(() => props.modelValue, (newValue) => {
      selectedOption.value = newValue;
    });

    const select = (val) => {
      selectedOption.value = val;
    };

    return {
      selectedOption,
      select
    };
  }
};
</script>

<style scoped>
.sort-options {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.5rem;
}
.sort-label {
  color: #23405a;
  font-weight: 600;
  margin-right: 0.5rem;
}
.sort-radio-group {
  display: flex;
  gap: 0.7rem;
}
.sort-radio-btn {
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
.sort-radio-btn.active,
.sort-radio-btn:hover {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  border-color: #92d2f9;
  box-shadow: 0 4px 16px #92d2f988;
}
@media (max-width: 600px) {
  .sort-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .sort-radio-group {
    gap: 0.4rem;
  }
  .sort-radio-btn {
    font-size: 0.93rem;
    padding: 0.35rem 0.8rem;
  }
}
</style>