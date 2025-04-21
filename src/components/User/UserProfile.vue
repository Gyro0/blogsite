<template>
  <div class="profile-card">
    <div class="profile-header">
      <span class="profile-icon">
        <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="#a8daf9"/><rect x="4" y="15" width="16" height="6" rx="3" fill="#cde2ee"/></svg>
      </span>
      <h2>Mon Profil</h2>
    </div>
    <div class="profile-info">
      <p><strong>Nom :</strong> {{ displayName }}</p>
      <p><strong>Email :</strong> {{ email }}</p>
    </div>
    <form class="profile-form" @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="displayName">Nom d'utilisateur</label>
        <input id="displayName" v-model="editDisplayName" />
      </div>
      <button class="blue-btn profile-btn" type="submit">Enregistrer</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'UserProfile',
  setup() {
    const { currentUser } = useAuth();
    const displayName = ref(currentUser.value?.displayName || '');
    const email = ref(currentUser.value?.email || '');
    const editDisplayName = ref(displayName.value);

    const updateProfile = async () => {
      if (!currentUser.value) return;
      try {
        await currentUser.value.updateProfile({
          displayName: editDisplayName.value
        });
        displayName.value = editDisplayName.value;
        alert('Profil mis à jour !');
      } catch (error) {
        console.error("Error updating profile:", error);
        alert('Erreur lors de la mise à jour du profil.');
      }
    };

    return {
      displayName,
      editDisplayName,
      email,
      updateProfile
    };
  }
};
</script>

<style scoped>
.profile-card {
  max-width: 400px;
  margin: 3.5rem auto 0 auto;
  background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
  border-radius: 22px;
  box-shadow: 0 2px 24px #a8daf955;
  padding: 2.5rem 2rem 1.5rem 2rem;
  color: #23405a;
  border: 1.5px solid #bbdcf0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}
.profile-icon {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.profile-header h2 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
  color: #92d2f9;
  margin-bottom: 0.2rem;
  text-shadow: 0 2px 8px #a8daf955;
}

.profile-info {
  width: 100%;
  margin-bottom: 1.5rem;
  color: #23405a;
  font-size: 1.08rem;
}
.profile-info p {
  margin-bottom: 0.5rem;
}

.profile-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-group label {
  font-weight: 600;
  color: #23405a;
  margin-bottom: 0.1rem;
}
.form-group input {
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
.form-group input:focus {
  border-color: #a8daf9;
}

.blue-btn.profile-btn {
  width: 100%;
  margin-top: 0.5rem;
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
  display: inline-block;
  font-size: 1.1rem;
  position: relative;
}
.blue-btn.profile-btn:hover {
  background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
  color: #23405a !important;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 24px #92d2f988;
}

@media (max-width: 600px) {
  .profile-card {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    border-radius: 1rem;
    margin-top: 1.5rem;
  }
  .profile-header h2 {
    font-size: 1.3rem;
  }
}
</style>