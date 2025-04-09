<template>
    <div class="container mt-4">
      <b-jumbotron header="404 - Page introuvable" lead="La page demandée n'existe pas.">
        <hr class="my-4" />
        <p>
          <b-button variant="primary" to="/">Retour à l'accueil</b-button>
        </p>
      </b-jumbotron>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundView'
  };
  </script>
  