<template>
  <div class="home-hero">
    <div class="hero-content">
      <h1>
        Bienvenue sur <span>MyForum</span>
      </h1>
      <p class="hero-lead">
        Partagez, discutez et découvrez les sujets qui vous passionnent dans une ambiance douce et moderne.
      </p>
      <router-link v-if="!currentUser" to="/register" class="blue-btn cta-btn">
        <i class="bi bi-person-plus"></i> Rejoindre la communauté
      </router-link>
    </div>
  </div>

  <div class="home-main">
    <main class="main-content">
      <div class="blue-card search-card">
        <SearchBar @search="handleSearch" />
        <SortOptions v-model="sortOption" :options="sortOptions" class="mb-3" />
      </div>
      <div class="blue-card discussions-card">
        <CategoryHeader 
          v-if="selectedCategory !== 'All'" 
          :category="selectedCategory" 
          :count="filteredDiscussions.length"
        />
        <div v-if="isLoading" class="centered">
          <span class="blue-alert">Chargement...</span>
        </div>
        <div v-else-if="filteredDiscussions.length === 0" class="blue-alert">
          Aucune discussion ne correspond à vos critères de recherche.
        </div>
        <DiscussionList 
          v-else
          :discussions="filteredDiscussions" 
          :responseCount="discussionResponses" 
        />
      </div>
    </main>

    <aside class="sidebar">
      <div class="blue-card">
        <CategoryFilter 
          :categories="allCategories" 
          v-model="selectedCategory" 
          @filter="handleFilter"
        />
      </div>
      <div class="blue-card" v-if="currentUser">
        <router-link to="/create-discussion" class="blue-btn create-btn">
          <i class="bi bi-plus-circle"></i> Nouvelle discussion
        </router-link>
      </div>
    </aside>
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
    SearchBar,
    CategoryFilter,
    DiscussionList,
    SortOptions,
    CategoryHeader
  },
  setup() {
    const { getAllItems } = useFirestore('discussions');
    const { getAllItems: getResponses } = useFirestore('responses');
    const { currentUser } = useAuth();

    const allDiscussions = ref([]);
    const discussionResponses = ref({});
    const searchTerm = ref('');
    const selectedCategory = ref('All');
    const sortOption = ref('newest');
    const isLoading = ref(false);

    const sortOptions = [
      { text: 'Plus récents', value: 'newest' },
      { text: 'Plus anciens', value: 'oldest' },
      { text: 'Plus populaires', value: 'popular' },
    ];

    const allCategories = [
      "All", "Tech", "News", "Sports", "Arts", "Science", "Health",
      "Politics", "Business", "Education", "Entertainment", 
      "Travel", "Food", "Fashion", "Gaming", "Music",
      "Books", "Movies", "DIY", "Photography"
    ];

    const loadDiscussions = async () => {
      isLoading.value = true;
      const data = await getAllItems({}, true);
      if (data) {
        allDiscussions.value = data;
        await loadResponseCounts();
      }
      isLoading.value = false;
    };

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

    onMounted(() => {
      loadDiscussions();
    });

    const filteredDiscussions = computed(() => {
      let result = [...allDiscussions.value];
      if (selectedCategory.value !== 'All') {
        result = result.filter(discussion => {
          if (!discussion.category) return false;
          return discussion.category.toLowerCase() === selectedCategory.value.toLowerCase();
        });
      }
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        result = result.filter(discussion => {
          const titleMatch = discussion.title?.toLowerCase().includes(term) || false;
          const contentMatch = discussion.content?.toLowerCase().includes(term) || false;
          const authorMatch = discussion.authorName?.toLowerCase().includes(term) || false;
          return titleMatch || contentMatch || authorMatch;
        });
      }
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

    const handleSearch = (term) => {
      searchTerm.value = term;
    };
    const handleFilter = (category) => {
      selectedCategory.value = category;
    };

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

<style scoped>
body {
  background: linear-gradient(135deg, #e4edf2 0%, #a8daf9 100%) fixed;
  color: #23405a;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  min-height: 100vh;
}

/* Hero Section */
.home-hero {
  width: 100vw;
  min-height: 220px;
  background: linear-gradient(120deg, #cde2ee 60%, #e4edf2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0 2rem 0;
  position: relative;
  overflow: hidden;
}
.hero-content {
  text-align: center;
  z-index: 2;
}
.hero-content h1 {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #92d2f9;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #a8daf9 40%, #92d2f9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-content h1 span {
  color: #92d2f9;
  background: none;
  -webkit-text-fill-color: initial;
}
.hero-lead {
  color: #23405a;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.cta-btn {
  margin-top: 1rem;
}

/* Main Layout */
.home-main {
  display: flex;
  gap: 2.5rem;
  max-width: 1300px;
  margin: 2.5rem auto 0 auto; /* Increased top margin for more space */
  padding: 0 2rem 2rem 2rem;
  position: relative;
  z-index: 2;
}
.main-content {
  flex: 2 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.sidebar {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Card styling */
.blue-card {
  background: linear-gradient(120deg, #fff 60%, #cde2ee 100%);
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 2rem 1.5rem;
  color: #23405a;
  margin-bottom: 2.5rem;
  border: 1.5px solid #bbdcf0;
  position: relative;
  overflow: hidden;
}
.search-card {
  margin-bottom: 0;
}
.discussions-card {
  margin-top: 0;
}

.create-btn {
  width: 100%;
  text-align: center;
  margin-top: 0.5rem;
}

/* Blue accent button */
.blue-btn {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a;
  font-weight: 700;
  border: none;
  border-radius: 2rem;
  padding: 0.7rem 2rem;
  box-shadow: 0 2px 8px #a8daf955;
  transition: background 0.2s, color 0.2s, transform 0.15s;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
}
.blue-btn:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 24px #92d2f988;
}

/* Alerts and Spinner */
.blue-alert {
  background: #e4edf2;
  color: #23405a;
  border: 1.5px solid #a8daf9;
  border-radius: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  text-align: center;
}
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  background: #e4edf2;
}
::-webkit-scrollbar-thumb {
  background: #a8daf9;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 1100px) {
  .home-main {
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 0.5rem 2rem 0.5rem;
  }
  .sidebar {
    flex-direction: row;
    gap: 1.5rem;
    justify-content: center;
  }
  .main-content {
    min-width: 0;
  }
}
@media (max-width: 700px) {
  .home-hero {
    padding: 2rem 0 1rem 0;
  }
  .hero-content h1 {
    font-size: 2rem;
  }
  .home-main {
    margin-top: -30px;
    padding: 0 0.2rem 1rem 0.2rem;
  }
  .blue-card {
    padding: 1rem 0.5rem;
    border-radius: 1rem;
  }
}
</style>
