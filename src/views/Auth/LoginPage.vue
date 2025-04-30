<template>
  <MainLayout>
    <ion-page>
      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Iniciar Sesión</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-input v-model="email" type="email" label="Correo" fill="outline" label-placement="floating"
              placeholder="ejemplo@correo.com"></ion-input>

            <ion-input type="password" v-model="password" label="Contraseña" fill="outline" label-placement="floating"
              placeholder="Tu contraseña">
              <ion-input-password-toggle slot="end" />
            </ion-input>

            <ion-button expand="full" class="ion-margin-top" @click="loginUser" :disabled="isLoading">
              {{ isLoading ? 'Cargando...' : 'Entrar' }}
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-alert :is-open="showAlert" header="Error" :message="errorMessage" @didDismiss="showAlert = false"
          :buttons="['OK']" />
      </ion-content>
    </ion-page>
  </MainLayout>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonContent,
  IonInput,
  IonPage,
  IonInputPasswordToggle,
} from '@ionic/vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { setToken } from '@/services/token';
import MainLayout from '@/layouts/MainLayout.vue';

const email = ref('');
const password = ref('');
const showAlert = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const router = useRouter();

const loginUser = async () => {
  isLoading.value = true;
  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    setToken(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));  // Guarda el usuario en localStorage
    router.push('/home');
  } catch (error) {
    const err = error as any;
    showAlert.value = true;
    errorMessage.value = err.response?.data?.message || 'Credenciales incorrectas';
  } finally {
    isLoading.value = false;
  }
};

</script>
