<template>
  <form class="search-bar" @submit.prevent="emitSearch">
    <label for="search-input" class="search-label">Rechercher des discussions :</label>
    <div class="search-row">
      <input
        id="search-input"
        v-model="searchTerm"
        class="search-input"
        type="text"
        placeholder="Mots-clés..."
        @keyup.enter="emitSearch"
      />
      <button class="blue-btn search-btn" type="submit">
        <i class="bi bi-search"></i>
        Rechercher
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchTerm: ''
    };
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.searchTerm);
    }
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
}
.search-label {
  color: #23405a;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.search-row {
  display: flex;
  gap: 0.7rem;
  align-items: center;
}
.search-input {
  flex: 1 1 0;
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  box-shadow: 0 1px 4px #a8daf922;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.18s;
}
.search-input:focus {
  border-color: #a8daf9;
}
.blue-btn.search-btn {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a !important;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.7rem 2rem;
  box-shadow: 0 2px 8px #a8daf955;
  transition: background 0.2s, color 0.2s, transform 0.15s;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
}
.blue-btn.search-btn:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a !important;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 24px #92d2f988;
}
@media (max-width: 600px) {
  .search-row {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  .blue-btn.search-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
