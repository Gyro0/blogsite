<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
body {
  background: linear-gradient(135deg, #e4edf2 0%, #a8daf9 100%) fixed;
  color: #23405a;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  min-height: 100vh;
  margin: 0;
}

/* Example discussion card styling */
.discussion-card {
  transition: all 0.2s ease;
  border-radius: 0.7rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(120deg, #fff 60%, #cde2ee 100%);
  color: #23405a;
  box-shadow: 0 2px 12px #a8daf955;
  border: 1.5px solid #bbdcf0;
}

.discussion-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 24px #92d2f988;
  border-color: #92d2f9;
}

/* Blue accent classes for buttons, links, etc. */
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

/* Example for blue alert/info */
.blue-alert {
  background: #e4edf2;
  color: #23405a;
  border: 1.5px solid #a8daf9;
  border-radius: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
}

::-webkit-scrollbar {
  width: 10px;
  background: #e4edf2;
}
::-webkit-scrollbar-thumb {
  background: #a8daf9;
  border-radius: 8px;
}
</style>
