<template>
  <div>
    <h4>
      <b-badge variant="secondary">
        {{ category }}
      </b-badge>
      <span class="ml-2">{{ count }} discussion(s)</span>
    </h4>
  </div>
</template>

<script>
export default {
  name: 'CategoryHeader',
  props: {
    // Name of the current category
    category: {
      type: String,
      required: true
    },
    // Count of discussions in this category
    count: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.ml-2 {
  margin-left: 0.5rem;
}
</style>