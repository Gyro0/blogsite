<template>
  <div>
    <b-form-input
      v-model="searchTerm"
      placeholder="Rechercher un utilisateur..."
      class="mb-3"
    ></b-form-input>
    
    <b-table :items="filteredUsers" :fields="fields" responsive>
      <template #cell(role)="data">
        <b-badge :variant="getRoleVariant(data.item.role)">{{ data.item.role }}</b-badge>
      </template>
      
      <template #cell(actions)="data">
        <b-dropdown text="Actions" size="sm" variant="outline-primary">
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

export default {
  name: 'UserManagement',
  setup() {
    const users = ref([]);
    const searchTerm = ref('');
    const { getAllItems, updateItem } = useFirestore('users');
    
    const fields = [
      { key: 'displayName', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Rôle' },
      { key: 'actions', label: 'Actions' }
    ];
    
    const loadUsers = async () => {
      const usersData = await getAllItems();
      users.value = usersData;
    };
    
    const filteredUsers = computed(() => {
      if (!searchTerm.value) return users.value;
      
      const term = searchTerm.value.toLowerCase();
      return users.value.filter(user => 
        user.displayName?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term)
      );
    });
    
    const getRoleVariant = (role) => {
      const variants = {
        admin: 'danger',
        moderator: 'warning',
        user: 'success'
      };
      return variants[role] || 'secondary';
    };
    
    const updateUserRole = async (user, newRole) => {
      if (confirm(`Êtes-vous sûr de vouloir changer le rôle de ${user.displayName} en ${newRole}?`)) {
        await updateItem(user.id, { role: newRole });
        await loadUsers();
      }
    };
    
    const makeAdmin = (user) => updateUserRole(user, 'admin');
    const makeModerator = (user) => updateUserRole(user, 'moderator');
    const makeUser = (user) => updateUserRole(user, 'user');
    
    const banUser = async (user) => {
      if (confirm(`Êtes-vous sûr de vouloir bannir ${user.displayName}?`)) {
        await updateItem(user.id, { 
          banned: true,
          bannedAt: new Date()
        });
        await loadUsers();
      }
    };
    
    onMounted(loadUsers);
    
    return {
      users,
      searchTerm,
      filteredUsers,
      fields,
      getRoleVariant,
      makeAdmin,
      makeModerator,
      makeUser,
      banUser
    };
  }
};
</script>