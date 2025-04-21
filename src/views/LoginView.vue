<template>
    <div class="container mt-4">
      <LoginForm />
    </div>
  </template>
  
  <script>
  import LoginForm from '@/components/Auth/LoginForm.vue';
  
  export default {
    name: 'LoginView',
    components: {
      LoginForm
    }
  };
  </script>

  <style scoped>
  .container {
    max-width: 420px;
    margin: 3rem auto 0 auto;
    background: linear-gradient(120deg, #e4edf2 60%, #cde2ee 100%);
    border-radius: 18px;
    box-shadow: 0 2px 16px #a8daf955;
    padding: 2.5rem 2rem;
    color: #23405a;
    border: 1.5px solid #bbdcf0;
  }

  h1, h2 {
    color: #23405a;
    font-weight: 800;
    letter-spacing: -1px;
    text-shadow: 0 2px 8px #a8daf955;
  }

  .b-button, button, input[type="submit"] {
    background: linear-gradient(90deg, #a8daf9 0%, #92d2f9 100%);
    color: #23405a !important;
    border: none;
    font-weight: 600;
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 2px 8px #a8daf955;
    border-radius: 2rem;
    padding: 0.7rem 2rem;
  }

  .b-button:hover, button:hover, input[type="submit"]:hover {
    background: linear-gradient(90deg, #92d2f9 0%, #a8daf9 100%);
    color: #23405a !important;
    box-shadow: 0 6px 24px #92d2f988;
  }
  
  @media (max-width: 600px) {
    .container {
      padding: 1.2rem 0.5rem;
      margin-top: 1.5rem;
    }
  }
  </style>
