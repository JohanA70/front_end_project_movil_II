<template>
  <div class="container py-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb bg-light p-2 rounded shadow-sm">
        <li class="breadcrumb-item active" aria-current="page">Editar Proyecto</li>
      </ol>
    </nav>

    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <!-- Botón Volver -->
          <a href="#" @click.prevent="goBack" class="btn btn-outline-secondary shadow">
            ⬅️ Volver
          </a>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header bg-black text-white fw-bold">
            Editar Proyecto
          </div>

          <div class="card-body bg-light">
            <form @submit.prevent="actualizarProyecto">
              <div class="mb-3">
                <label for="name" class="form-label fw-semibold">Nombre del Proyecto</label>
                <input
                  type="text"
                  v-model="form.name"
                  id="name"
                  class="form-control shadow-sm"
                  placeholder="Escribe un nombre..."
                  required
                />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label fw-semibold">Descripción</label>
                <textarea
                  v-model="form.description"
                  id="description"
                  rows="4"
                  class="form-control shadow-sm"
                  placeholder="Agrega una breve descripción..."
                ></textarea>
              </div>

              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary px-4">
                  Actualizar Proyecto
                </button>
              </div>
            </form>

            <div v-if="mensaje" class="alert alert-success mt-3">
              {{ mensaje }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

// Variables y hooks
const route = useRoute()
const router = useRouter()
const mensaje = ref('')
const form = ref({
  name: '',
  description: ''
})

// Función para volver a la lista
const goBack = () => {
  router.push('/projects')
}

// Cargar datos del proyecto
const cargarProyecto = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://127.0.0.1:8000/api/projects/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    form.value = response.data
  } catch (error) {
    console.error('Error al cargar proyecto:', error)
    mensaje.value = '❌ Error al cargar el proyecto.'
  }
}

// Actualizar proyecto
const actualizarProyecto = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://127.0.0.1:8000/api/projects/${route.params.id}`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    mensaje.value = '✅ Proyecto actualizado exitosamente.'
    setTimeout(() => {
        router.push(`/projects/`)
    }, 1500)
  } catch (error) {
    console.error('Error al actualizar proyecto:', error)
    mensaje.value = '❌ Ocurrió un error al actualizar el proyecto.'
  }
}

// Ejecutar al montar
onMounted(() => {
  cargarProyecto()
})
</script>

<style scoped>
/* Estilos adicionales si querés */
</style>
