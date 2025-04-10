<template>
  <div>
    <h1 class="mb-4">Forum communautaire</h1>
    
    <div class="row">
      <!-- Left column: Search and discussions -->
      <div class="col-md-8 pr-md-4">
        <!-- Search bar -->
        <SearchBar @search="handleSearch" class="mb-4" />
        
        <!-- Sort options -->
        <SortOptions 
          v-model="sortOption" 
          :options="sortOptions" 
          class="mb-4" 
        />
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="text-center py-4">
          <b-spinner variant="primary" label="Chargement..."></b-spinner>
        </div>
        
        <!-- No results message -->
        <b-alert v-else-if="filteredDiscussions.length === 0" show variant="info">
          Aucune discussion ne correspond à vos critères de recherche.
        </b-alert>
        
        <!-- Category header when a specific category is selected -->
        <CategoryHeader 
          v-if="selectedCategory !== 'All'" 
          :category="selectedCategory" 
          :count="filteredDiscussions.length" 
          class="mb-3" 
        />
        
        <!-- Discussions list -->
        <DiscussionList 
          :discussions="filteredDiscussions" 
          :responseCount="discussionResponses" 
        />
      </div>
      
      <!-- Right column: Categories -->
      <div class="col-md-4">
        <div class="position-sticky" style="top: 20px;">
          <!-- Category filter -->
          <CategoryFilter 
            :categories="allCategories" 
            v-model="selectedCategory" 
            @filter="handleFilter" 
            class="mb-4" 
          />
          
          <!-- Create new discussion button -->
          <b-card v-if="currentUser" class="mb-4">
            <b-button 
              variant="success" 
              class="w-100" 
              to="/create-discussion"
            >
              <i class="bi bi-plus-circle"></i> Nouvelle discussion
            </b-button>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import SearchBar from '@/components/Common/SearchBar.vue';
import CategoryFilter from '@/components/Common/CategoryFilter.vue';
import DiscussionList from '@/components/Discussions/DiscussionList.vue';
import SortOptions from '@/components/Common/SortOptions.vue';
import CategoryHeader from '@/components/Common/CategoryHeader.vue';
import { useFirestore } from '@/composables/useFirestore';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'HomeView',
  components: {
    SearchBar,       // Component for searching discussions
    CategoryFilter,  // Component for filtering by category
    DiscussionList,  // Component for displaying discussions
    SortOptions,     // Component for sorting discussions
    CategoryHeader   // Component showing category title and count
  },
  setup() {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Get Firestore utilities
    const { getAllItems } = useFirestore('discussions');
    const { getAllItems: getResponses } = useFirestore('responses');
    
    // Get current user
    const { currentUser } = useAuth();

    // All discussions loaded from Firestore
    const allDiscussions = ref([]);
    
    // Map of discussion IDs to response counts
    const discussionResponses = ref({});
    
    // User filter and sort preferences
    const searchTerm = ref('');
    const selectedCategory = ref('All');
    const sortOption = ref('newest');
    
    // Loading state
    const isLoading = ref(false);
    
    // Available sort options
    const sortOptions = [
      { text: 'Plus récents', value: 'newest' },
      { text: 'Plus anciens', value: 'oldest' },
      { text: 'Plus populaires', value: 'popular' },
    ];

    // Available categories
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
    
    // --------------------------------------------------------------
    // Data Loading
    // --------------------------------------------------------------

    // Load all discussions from Firestore
    const loadDiscussions = async () => {
      isLoading.value = true;
      const data = await getAllItems({}, true);
      
      if (data) {
        allDiscussions.value = data;
        await loadResponseCounts();
      }
      
      isLoading.value = false;
    };

    // Load response counts for each discussion
    const loadResponseCounts = async () => {
      const allResponses = await getResponses({}, false);
      
      const counts = {};
      allResponses.forEach(response => {
        const discussionId = response.discussionId;
        if (discussionId) {
          counts[discussionId] = (counts[discussionId] || 0) + 1;
        }
      });
      
      discussionResponses.value = counts;
    };
    
    // --------------------------------------------------------------
    // Lifecycle Hooks
    // --------------------------------------------------------------

    // Load discussions when component mounts
    onMounted(() => {
      loadDiscussions();
    });
    
    // --------------------------------------------------------------
    // Computed Properties
    // --------------------------------------------------------------

    // Filtered and sorted discussions based on user preferences
    const filteredDiscussions = computed(() => {
      let result = [...allDiscussions.value];
      
      // Filter by category if not "All"
      if (selectedCategory.value !== 'All') {
        result = result.filter(discussion => {
          if (!discussion.category) return false;
          return discussion.category.toLowerCase() === selectedCategory.value.toLowerCase();
        });
      }
      
      // Filter by search term if provided
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        result = result.filter(discussion => {
          const titleMatch = discussion.title?.toLowerCase().includes(term) || false;
          const contentMatch = discussion.content?.toLowerCase().includes(term) || false;
          const authorMatch = discussion.authorName?.toLowerCase().includes(term) || false;
          
          return titleMatch || contentMatch || authorMatch;
        });
      }
      
      // Sort according to selected option
      result.sort((a, b) => {
        switch (sortOption.value) {
          case 'newest':
            const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
            return dateB - dateA;
            
          case 'oldest':
            const dateAOld = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
            const dateBOld = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
            return dateAOld - dateBOld;
            
          case 'popular':
            const responsesA = discussionResponses.value[a.id] || 0;
            const responsesB = discussionResponses.value[b.id] || 0;
            return responsesB - responsesA;
            
          default:
            return 0;
        }
      });
      
      return result;
    });
    
    // --------------------------------------------------------------
    // Event Handlers
    // --------------------------------------------------------------

    // Handle search event from SearchBar component
    const handleSearch = (term) => {
      searchTerm.value = term;
    };

    // Handle filter event from CategoryFilter component
    const handleFilter = (category) => {
      selectedCategory.value = category;
    };
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      allCategories,
      filteredDiscussions,
      selectedCategory,
      sortOption,
      sortOptions,
      isLoading,
      handleSearch,
      handleFilter,
      discussionResponses,
      currentUser
    };
  }
};
</script>
