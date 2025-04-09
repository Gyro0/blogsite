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

  // Vérifie si la route requiert d'être authentifié
  if (to.meta.requiresAuth && !currentUser.value) {
    return { name: 'Login' }; // Redirige vers Login
  }

  // Exemple simple : vérifie si la route requiert d'être modérateur ou admin
  // Pour plus de robustesse, on pourrait vérifier en base le rôle de l'utilisateur
  if (to.meta.requiresMod && currentUser.value) {
    // Ici on pourrait utiliser useModerator() et checkModerator()
    // Pour la démo, on part du principe qu'on a un champ custom claims, etc.
    // Ou alors on redirige si l'utilisateur n'a pas le rôle requis
  }

  return true;
});

export default router;
