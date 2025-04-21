<template>
  <div class="category-header">
    <h4>
      <span class="category-badge">{{ category }}</span>
      <span class="ml-2">{{ count }} discussion(s)</span>
    </h4>
  </div>
</template>

<script>
export default {
  name: 'CategoryHeader',
  props: {
    category: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.category-header h4 {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #23405a;
  margin-bottom: 1.2rem;
  letter-spacing: -0.5px;
}

.category-badge {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.35em 1.2em;
  margin-right: 0.7rem;
  box-shadow: 0 2px 8px #a8daf955;
  border: 1.5px solid #bbdcf0;
  display: inline-block;
}

.ml-2 {
  margin-left: 0.5rem;
  color: #23405a;
  font-weight: 500;
  opacity: 0.85;
}
</style>