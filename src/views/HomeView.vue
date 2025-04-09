<template>
    <div>
      <!-- Barre de recherche et filtre catégorie -->
      <SearchBar @search="handleSearch" />
      <CategoryFilter :categories="allCategories" @filter="handleFilter" />
  
      <!-- Affichage des discussions récentes/populaires -->
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
  
      const allCategories = ["All", "Tech", "News", "Sports", "Arts"];
  
      const loadDiscussions = async () => {
        // On peut récupérer toutes les discussions, triées par date
        const data = await getAllItems({}, true);
        if (!error.value && data) {
          allDiscussions.value = data;
        }
      };
  
      onMounted(() => {
        loadDiscussions();
      });
  
      // Filtrage final sur la base des discussions
      const filteredDiscussions = computed(() => {
        // Filtrer par catégorie
        let result = [...allDiscussions.value];
        if (selectedCategory.value !== 'All') {
          result = result.filter(d => d.category === selectedCategory.value);
        }
        // Filtrer par recherche
        if (searchTerm.value) {
          result = result.filter(d =>
            d.title?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            d.content?.toLowerCase().includes(searchTerm.value.toLowerCase())
          );
        }
        return result;
      });
  
      const handleSearch = (term) => {
        searchTerm.value = term;
      };
  
      const handleFilter = (category) => {
        selectedCategory.value = category;
      };
  
      return {
        allCategories,
        filteredDiscussions,
        handleSearch,
        handleFilter
      };
    }
  };
  </script>
  