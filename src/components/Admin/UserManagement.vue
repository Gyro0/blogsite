<template>
  <div>
    <b-form-input
      v-model="searchTerm"
      placeholder="Rechercher un utilisateur..."
      class="mb-3"
    ></b-form-input>
    
    <b-table :items="filteredUsers" :fields="fields" responsive>
      <template #cell(role)="data">
        <b-badge :variant="getRoleVariant(data.item)">
          {{ getDisplayRole(data.item) }}
        </b-badge>
      </template>
      
      <template #cell(actions)="data">
        <!-- Différentes actions basées sur le statut banned -->
        <div v-if="data.item.banned">
          <b-button size="sm" variant="success" @click="unbanUser(data.item)">
            Débannir l'utilisateur
          </b-button>
        </div>
        <b-dropdown v-else text="Actions" size="sm" variant="outline-primary">
          <b-dropdown-item @click="makeAdmin(data.item)" v-if="data.item.role !== 'admin'">
            Faire admin
          </b-dropdown-item>
          <b-dropdown-item @click="makeModerator(data.item)" v-if="data.item.role !== 'moderator'">
            Faire modérateur
          </b-dropdown-item>
          <b-dropdown-item @click="makeUser(data.item)" v-if="data.item.role !== 'user'">
            Retirer privilèges
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="banUser(data.item)" variant="danger">
            Bannir utilisateur
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
import { useAuth } from '@/composables/useAuth';
import { auth, db, firebase } from '@/firebase/firebaseInit';

export default {
  name: 'UserManagement',
  setup() {
    // --------------------------------------------------------------
    // State Management
    // --------------------------------------------------------------
    
    // Store users data fetched from Firestore
    const users = ref([]);
    
    // Track search input for filtering users
    const searchTerm = ref('');
    
    // Prevent concurrent operations to avoid conflicts
    const isOperationInProgress = ref(false);
    
    // Get Firestore and Auth utilities from composables
    const { getAllItems, updateItem } = useFirestore('users');
    const { forceTokenRefresh } = useAuth();
    
    // --------------------------------------------------------------
    // Table Configuration
    // --------------------------------------------------------------
    
    // Define table column structure
    const fields = [
      { key: 'displayName', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Rôle' },
      { key: 'actions', label: 'Actions' }
    ];
    
    // --------------------------------------------------------------
    // Data Loading
    // --------------------------------------------------------------
    
    // Load users from Firebase and update local state
    const loadUsers = async () => {
      try {
        // Refresh token to ensure up-to-date permissions
        await forceTokenRefresh();
        
        // Fetch all users from Firestore
        const usersData = await getAllItems({}, true);
        users.value = usersData;
      } catch (error) {
        alert('Erreur lors du chargement des utilisateurs: ' + error.message);
      }
    };
    
    // --------------------------------------------------------------
    // Computed Properties
    // --------------------------------------------------------------
    
    // Filter users based on search term
    const filteredUsers = computed(() => {
      if (!searchTerm.value) return users.value;
      
      const term = searchTerm.value.toLowerCase();
      return users.value.filter(user => 
        user.displayName?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term)
      );
    });
    
    // Determine badge color based on user role or banned status
    const getRoleVariant = (user) => {
      if (user.banned) {
        return 'dark'; // Banned users get dark badge
      }
      
      const variants = {
        admin: 'danger',     // Admins get red badge
        moderator: 'warning', // Moderators get yellow badge
        user: 'success'       // Regular users get green badge
      };
      return variants[user.role] || 'secondary';
    };
    
    // Get display text for user role, showing special status for banned users
    const getDisplayRole = (user) => {
      if (user.banned) {
        return 'banned user';
      }
      return user.role || 'user';
    };
    
    // --------------------------------------------------------------
    // User Role Management
    // --------------------------------------------------------------
    
    // Update user role (admin, moderator, user)
    const updateUserRole = async (user, newRole) => {
      if (isOperationInProgress.value) {
        alert("Une opération est déjà en cours, veuillez patienter");
        return;
      }
      
      const userId = user.id || user.uid;
      
      if (!userId) {
        alert("Une erreur est survenue: ID utilisateur manquant");
        return;
      }
      
      if (confirm(`Êtes-vous sûr de vouloir changer le rôle de ${user.displayName || user.email} en ${newRole}?`)) {
        try {
          isOperationInProgress.value = true;
          
          // Refresh user token to ensure current permissions
          await auth.currentUser.getIdToken(true);
          
          // Verify user is authenticated
          if (!auth.currentUser) {
            throw new Error("Vous devez être connecté pour effectuer cette action");
          }
          
          // Update user role in Firestore
          await updateItem(userId, { role: newRole });
          
          // Update local state for immediate UI update
          const userIndex = users.value.findIndex(u => u.id === userId || u.uid === userId);
          if (userIndex !== -1) {
            users.value[userIndex].role = newRole;
          }
          
        } catch (error) {
          // Handle quota exceeded error specifically
          if (error.message.includes("quota")) {
            alert("Limite de quota Firebase atteinte. Veuillez réessayer plus tard.");
          } else {
            alert(`Erreur lors de la mise à jour: ${error.message}`);
          }
        } finally {
          isOperationInProgress.value = false;
        }
      }
    };
    
    // Make user an admin - wrapper for updateUserRole
    const makeAdmin = (user) => updateUserRole(user, 'admin');
    
    // Make user a moderator - wrapper for updateUserRole
    const makeModerator = (user) => updateUserRole(user, 'moderator');
    
    // Remove elevated privileges - wrapper for updateUserRole
    const makeUser = (user) => updateUserRole(user, 'user');
    
    // --------------------------------------------------------------
    // User Ban Management
    // --------------------------------------------------------------
    
    // Ban a user by setting banned flag and recording ban metadata
    const banUser = async (user) => {
      if (isOperationInProgress.value) {
        alert("Une opération est déjà en cours, veuillez patienter");
        return;
      }
      
      const userId = user.id || user.uid;
      
      if (!userId) {
        alert("Une erreur est survenue: ID utilisateur manquant");
        return;
      }
      
      if (confirm(`Êtes-vous sûr de vouloir bannir ${user.displayName || user.email}?`)) {
        try {
          isOperationInProgress.value = true;
          
          // Refresh token to ensure current permissions
          await auth.currentUser.getIdToken(true);
          
          // Update user document with ban information
          await db.collection('users').doc(userId).update({
            banned: true,
            bannedAt: firebase.firestore.FieldValue.serverTimestamp(),
            bannedBy: auth.currentUser.uid
          });
          
          // Update local state for immediate UI update
          const userIndex = users.value.findIndex(u => u.id === userId || u.uid === userId);
          if (userIndex !== -1) {
            users.value[userIndex].banned = true;
          }
          
          alert(`L'utilisateur ${user.displayName || user.email} a été banni avec succès.`);
          
        } catch (error) {
          // Handle specific error types with appropriate messages
          if (error.code === 'permission-denied') {
            alert("Erreur: Vous n'avez pas les permissions nécessaires pour cette action.");
          } else if (error.message.includes("quota")) {
            alert("Limite de quota Firebase atteinte. Veuillez réessayer plus tard.");
          } else {
            alert(`Erreur: ${error.message}`);
          }
        } finally {
          isOperationInProgress.value = false;
        }
      }
    };

    // Unban a user by removing banned flag and adding unban metadata
    const unbanUser = async (user) => {
      if (isOperationInProgress.value) {
        alert("Une opération est déjà en cours, veuillez patienter");
        return;
      }
      
      const userId = user.id || user.uid;
      
      if (!userId) {
        alert("Une erreur est survenue: ID utilisateur manquant");
        return;
      }
      
      if (confirm(`Êtes-vous sûr de vouloir débannir ${user.displayName || user.email}?`)) {
        try {
          isOperationInProgress.value = true;
          
          // Refresh token to ensure current permissions
          await auth.currentUser.getIdToken(true);
          
          // Update user document to remove ban
          await db.collection('users').doc(userId).update({
            banned: false,
            unbannedAt: firebase.firestore.FieldValue.serverTimestamp(),
            unbannedBy: auth.currentUser.uid
          });
          
          // Update local state for immediate UI update
          const userIndex = users.value.findIndex(u => u.id === userId || u.uid === userId);
          if (userIndex !== -1) {
            users.value[userIndex].banned = false;
          }
          
          alert(`L'utilisateur ${user.displayName || user.email} a été débanni avec succès.`);
          
        } catch (error) {
          // Handle specific error types with appropriate messages
          if (error.code === 'permission-denied') {
            alert("Erreur: Vous n'avez pas les permissions nécessaires pour cette action.");
          } else if (error.message.includes("quota")) {
            alert("Limite de quota Firebase atteinte. Veuillez réessayer plus tard.");
          } else {
            alert(`Erreur: ${error.message}`);
          }
        } finally {
          isOperationInProgress.value = false;
        }
      }
    };
    
    // --------------------------------------------------------------
    // Lifecycle Hooks
    // --------------------------------------------------------------
    
    // Load users when component is mounted
    onMounted(async () => {
      try {
        await loadUsers();
      } catch (error) {
        console.error("Erreur au chargement initial:", error);
      }
    });
    
    // --------------------------------------------------------------
    // Expose component API
    // --------------------------------------------------------------
    return {
      users,
      searchTerm,
      filteredUsers,
      fields,
      getRoleVariant,
      getDisplayRole,
      makeAdmin,
      makeModerator,
      makeUser,
      banUser,
      unbanUser
    };
  }
};
</script>

<style scoped>
.b-form-input {
  border-radius: 1.2rem;
  border: 1.5px solid #bbdcf0;
  background: #fff;
  color: #23405a;
  box-shadow: 0 1px 4px #a8daf922;
  padding: 0.6rem 1.2rem;
  margin-bottom: 1.2rem;
}

.b-table {
  background: #fff;
  border-radius: 1rem;
  border: 1px solid #bbdcf0;
  box-shadow: 0 1px 8px #a8daf922;
  color: #23405a;
}

.b-badge {
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.97rem;
  padding: 0.35em 1em;
}
.b-badge-danger {
  background: #ffb3b3;
  color: #a94442;
}
.b-badge-warning {
  background: #fff3cd;
  color: #856404;
}
.b-badge-success {
  background: #cde2ee;
  color: #23405a;
}
.b-badge-dark {
  background: #bbdcf0;
  color: #23405a;
}
.b-badge-secondary {
  background: #e4edf2;
  color: #23405a;
}

.b-button,
.b-dropdown .dropdown-toggle {
  background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
  color: #23405a !important;
  border: none;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px #a8daf955;
  border-radius: 2rem;
  padding: 0.5rem 1.2rem;
  margin-right: 0.5rem;
}
.b-button:last-child {
  margin-right: 0;
}
.b-button:hover,
.b-dropdown .dropdown-toggle:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a !important;
  box-shadow: 0 6px 24px #92d2f988;
}

.b-dropdown-menu {
  border-radius: 1rem;
  border: 1px solid #bbdcf0;
  box-shadow: 0 2px 8px #a8daf955;
  background: #fff;
}

.b-dropdown-item {
  color: #23405a;
  font-weight: 500;
  border-radius: 0.7rem;
  transition: background 0.15s, color 0.15s;
}
.b-dropdown-item:hover {
  background: #e4edf2;
  color: #23405a;
}

.b-dropdown-divider {
  border-top: 1px solid #bbdcf0;
}

@media (max-width: 700px) {
  .b-table {
    font-size: 0.95rem;
  }
}
</style>