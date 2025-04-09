<template>
    <b-card title="Messages Signalés">
      <b-table :items="reports" :fields="fields">
        <template #cell(actions)="data">
          <b-button variant="danger" size="sm" @click="removeReport(data.item.id)">Supprimer</b-button>
        </template>
      </b-table>
    </b-card>
  </template>
  
  <script>
  export default {
    name: 'ReportList',
    data() {
      return {
        fields: [
          { key: 'id', label: 'ID' },
          { key: 'content', label: 'Contenu' },
          { key: 'actions', label: 'Actions' }
        ],
        reports: [
          // Exemple : { id: 'xyz', content: 'Message inapproprié' }
        ]
      };
    },
    methods: {
      removeReport(id) {
        alert('Suppression du report: ' + id);
        // Logique de suppression en base ou via un composable
      }
    }
  };
  </script>
  