<template>
  <div>
    <NavBar />
    <router-view></router-view> <!-- Esto mostrará el contenido de las rutas definidas -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'; // Importa tu componente NavBar
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  components: {
    NavBar
  }
};
</script>

<style>
/* Aquí puedes poner los estilos generales de la app si los necesitas */
</style>

