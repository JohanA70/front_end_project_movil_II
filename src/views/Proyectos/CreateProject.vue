<template>
    <div class="container py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-light p-2 rounded shadow-sm">
          <li class="breadcrumb-item active" aria-current="page">Crear Proyecto</li>
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
              Crear Nuevo Proyecto
            </div>
  
            <div class="card-body bg-light">
              <form @submit.prevent="crearProyecto">
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
                  <button type="submit" class="btn btn-success px-4">
                    Crear Proyecto
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
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

// Inicializar el enrutador
const router = useRouter()

// Función para redirigir al listado de proyectos
const goBack = () => {
  router.push('/projects') // Ruta que debe redirigir a la vista de proyectos
}
  const form = ref({
    name: '',
    description: ''
  })
  
  const mensaje = ref('')
  
  const crearProyecto = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://127.0.0.1:8000/api/projects', form.value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      mensaje.value = '✅ Proyecto creado exitosamente.'
      setTimeout(() => {
        router.push(`/projects/`)
      }, 1500)
      form.value.name = ''
      form.value.description = ''
    } catch (error) {
      console.error('Error al crear proyecto:', error)
      mensaje.value = '❌ Ocurrió un error al crear el proyecto.'
    }
  }
  </script>
  
  <style scoped>
  /* Puedes ajustar estilos aquí si usás Tailwind, Bootstrap o CSS propio */
  </style>
  