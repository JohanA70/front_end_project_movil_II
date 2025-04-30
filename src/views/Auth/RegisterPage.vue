<!--RegisterPage.vue-->
<template>
  <MainLayout>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Registro</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-input
          v-model="name"
          label="Nombre"
          fill="solid"
          label-placement="floating"
        ></ion-input>
        <ion-input
          v-model="email"
          label="Correo"
          fill="solid"
          label-placement="floating"
        ></ion-input>
        <ion-input
          type="password"
          v-model="password"
          label="Contraseña"
          fill="solid"
          label-placement="floating"
        >
          <ion-input-password-toggle slot="end" />
        </ion-input>
        <ion-input
          type="password"
          v-model="passwordConfirmation"
          label="Confirmar Contraseña"
          fill="solid"
          label-placement="floating"
        >
          <ion-input-password-toggle slot="end" />
        </ion-input>

        <ion-button expand="full" @click="registerUser">Registrar</ion-button>

        <ion-alert
          :is-open="showAlert"
          header="Error"
          :message="errorMessage"
          @didDismiss="showAlert = false"
          :buttons="alertButtons"
        />
      </ion-content>
    </ion-page>
  </MainLayout>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInputPasswordToggle,
} from "@ionic/vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { ref } from "vue";
import api from "@/services/api";
import { setToken } from "@/services/token";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const showAlert = ref(false);
const errorMessage = ref("");

const alertButtons = [
  {
    text: "OK",
    handler: () => {
      showAlert.value = false;
    },
  },
];

const router = useRouter();

const registerUser = async () => {
  try {
    const response = await api.post("/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    await setToken(response.data.token);
    router.push("/login");
  } catch (error: any) {
    console.error(error);
    showAlert.value = true;
    errorMessage.value = error.response?.data?.message || "Error al registrar";
  }
};
</script>
