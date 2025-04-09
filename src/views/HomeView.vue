<template>
  <div>
    <!-- Barre de recherche et filtre catégorie -->
    <SearchBar @search="handleSearch" />
    
    <!-- Button-based category filter -->
    <CategoryFilter 
      :categories="allCategories" 
      :value="selectedCategory"
      @filter="handleFilter" 
    />

    <!-- Affichage des discussions récentes/populaires -->
    <b-alert v-if="filteredDiscussions.length === 0" show variant="info">
      Aucune discussion ne correspond à vos critères de recherche.
    </b-alert>
    
    <div v-if="selectedCategory !== 'All'" class="mb-3">
      <h4>
        <b-badge :variant="info">
          {{ selectedCategory }}
        </b-badge>
        <span class="ml-2">{{ filteredDiscussions.length }} discussion(s)</span>
      </h4>
    </div>
    
    <DiscussionList :discussions="filteredDiscussions" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import SearchBar from '@/components/Common/SearchBar.vue';
import CategoryFilter from '@/components/Common/CategoryFilter.vue';
import DiscussionList from '@/components/Discussions/DiscussionList.vue';
import { useFirestore } from '@/composables/useFirestore';

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    CategoryFilter,
    DiscussionList
  },
  setup() {
    const { getAllItems, error } = useFirestore('discussions');

    const allDiscussions = ref([]);
    const searchTerm = ref('');
    const selectedCategory = ref('All');
    const isLoading = ref(false);

    // Expanded list of categories
    const allCategories = [
      "All", 
      "Tech", 
      "News", 
      "Sports", 
      "Arts", 
      "Science", 
      "Health",
      "Politics", 
      "Business", 
      "Education", 
      "Entertainment", 
      "Travel", 
      "Food", 
      "Fashion",
      "Gaming",
      "Music",
      "Books",
      "Movies",
      "DIY",
      "Photography"
    ];

    const loadDiscussions = async () => {
      isLoading.value = true;
      try {
        // Get all discussions sorted by date
        const data = await getAllItems({}, true);
        if (!error.value && data) {
          allDiscussions.value = data;
        }
      } catch (err) {
        console.error("Error loading discussions:", err);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadDiscussions();
    });

    // Improved filtering logic
    const filteredDiscussions = computed(() => {
      // Start with all discussions
      let result = [...allDiscussions.value];
      
      // Category filtering with case-insensitive comparison
      if (selectedCategory.value !== 'All') {
        result = result.filter(discussion => {
          // Handle null/undefined categories
          if (!discussion.category) return false;
          
          return discussion.category.toLowerCase() === selectedCategory.value.toLowerCase();
        });
      }
      
      // Search term filtering
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        result = result.filter(discussion => {
          const titleMatch = discussion.title?.toLowerCase().includes(term) || false;
          const contentMatch = discussion.content?.toLowerCase().includes(term) || false;
          const authorMatch = discussion.authorName?.toLowerCase().includes(term) || false;
          
          return titleMatch || contentMatch || authorMatch;
        });
      }
      
      return result;
    });

    const handleSearch = (term) => {
      searchTerm.value = term;
    };

    const handleFilter = (category) => {
      selectedCategory.value = category;
    };
    
    const getCategoryColor = (category) => {
      const colors = {
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
      
      return colors[category] || 'secondary';
    };

    return {
      allCategories,
      filteredDiscussions,
      selectedCategory,
      isLoading,
      handleSearch,
      handleFilter,
      getCategoryColor
    };
  }
};
</script>

<style scoped>
.ml-2 {
  margin-left: 0.5rem;
}
</style>
