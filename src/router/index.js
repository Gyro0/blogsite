import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ProfileView from '@/views/ProfileView.vue';
import DiscussionView from '@/views/DiscussionView.vue';
import CreateDiscussionView from '@/views/CreateDiscussionView.vue';
import CategoryView from '@/views/CategoryView.vue';
import AdminView from '@/views/AdminView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

import { useAuth } from '@/composables/useAuth';
import { useModerator } from '@/composables/useModerator';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/discussion/:id', name: 'Discussion', component: DiscussionView },
  { path: '/create-discussion', name: 'CreateDiscussion', component: CreateDiscussionView, meta: { requiresAuth: true } },
  { path: '/category/:cat', name: 'Category', component: CategoryView },
  { path: '/admin', name: 'Admin', component: AdminView, meta: { requiresAuth: true, requiresMod: true } },
  { path: '/:catchAll(.*)', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard pour protéger certaines routes
router.beforeEach(async (to, from) => {
  const { currentUser } = useAuth();
  const { isModerator, checkModerator } = useModerator();

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !currentUser.value) {
    return { name: 'Login' };
  }

  // Check if the route requires moderator privileges
  if (to.meta.requiresMod && currentUser.value) {
    await checkModerator();
    if (!isModerator.value) {
      // Redirect to home if not a moderator
      return { name: 'Home' };
    }
  }

  return true;
});

export default router;
