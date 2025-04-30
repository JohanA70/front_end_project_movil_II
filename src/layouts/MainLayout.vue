<!--MainLayout.vue-->
<template>
  <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menú</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item
          button
          :class="{ selected: isActive('/home') }"
          @click="goTo('/home')"
        >
          <ion-icon slot="start" name="home-outline"></ion-icon>
          Inicio
        </ion-item>
        <ion-item
          button
          :class="{ selected: isActive('/login') }"
          @click="goTo('/login')"
        >
          <ion-icon slot="start" name="log-in-outline"></ion-icon>
          Login
        </ion-item>
        <ion-item
          button
          :class="{ selected: isActive('/register') }"
          @click="goTo('/register')"
        >
          <ion-icon slot="start" name="person-add-outline"></ion-icon>
          Registrarse
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonIcon,
} from "@ionic/vue";

import { useRouter, useRoute } from "vue-router";
import { menuController } from "@ionic/vue";

const router = useRouter();
const route = useRoute();

const goTo = async (path: string) => {
  await menuController.close();
  router.push(path);
};

const isActive = (path: string) => route.path === path;

import { defineProps, defineEmits } from 'vue';

// Asegúrate de definir las props correctamente
const props = defineProps({
  registerIonPage: Function
});
</script>

<style scoped>
.selected {
  background-color: #dfe6e9;
  border-radius: 8px;
}
</style>
