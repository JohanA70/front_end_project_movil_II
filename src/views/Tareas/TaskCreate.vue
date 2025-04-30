<template>
    <div class="container py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-light p-2 rounded shadow-sm">
          <li class="breadcrumb-item active" aria-current="page">Crear Tareas</li>
        </ol>
      </nav>
  
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <router-link :to="`/projects/${projectId}`" class="btn btn-outline-secondary shadow">
              ⬅️ Volver
            </router-link>
          </div>
  
          <div class="card shadow-sm border-0">
            <div class="card-header bg-black text-white fw-bold">
              Crear Nueva Tarea - Proyecto: {{ projectName || '...' }}
            </div>
  
            <div class="card-body bg-light">
              <form @submit.prevent="createTask">
                <div class="mb-3">
                  <label for="name" class="form-label fw-semibold">Nombre de la Tarea</label>
                  <input v-model="form.name" type="text" class="form-control shadow-sm" id="name" required>
                </div>
  
                <div class="mb-3">
                  <label for="description" class="form-label fw-semibold">Descripción</label>
                  <textarea v-model="form.description" class="form-control shadow-sm" id="description" rows="4" required></textarea>
                </div>
  
                <div class="mb-3">
                  <label for="user_id" class="form-label fw-semibold">Asignar Usuario</label>
                  <select v-model="form.user_id" class="form-select shadow-sm" id="user_id" required>
                    <option disabled value="">Selecciona un usuario...</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
  
                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-success px-4">Crear Tarea</button>
                </div>
              </form>
  
              <div v-if="mensaje" class="alert mt-3" :class="mensaje.includes('✅') ? 'alert-success' : 'alert-danger'">
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
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const router = useRouter()
  const projectId = route.params.id
  
  const form = ref({
    name: '',
    description: '',
    user_id: ''
  })
  
  const users = ref([])
  const projectName = ref('')
  const mensaje = ref('')
  
  onMounted(async () => {
    
    try {
        const token = localStorage.getItem('token')

        const [usersResponse, projectResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/users', {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }),
        axios.get(`/api/projects/${projectId}`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        })
        ])
        
        users.value = usersResponse.data

        projectName.value = projectResponse.data.name
    } catch (error) {
        console.error('Error al cargar datos:', error)
        mensaje.value = '❌ No se pudieron cargar los datos del proyecto o los usuarios.'
    }
    })
    const createTask = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`http://127.0.0.1:8000/api/projects/${projectId}/tasks`, form.value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      mensaje.value = '✅ Tarea creado exitosamente.'
      setTimeout(() => {
        router.push(`/projects/${projectId}`)
      }, 1500)
      form.value.name = ''
      form.value.description = ''
    } catch (error) {
      console.error('Error al crear tarea:', error)
      mensaje.value = '❌ Ocurrió un error al crear el tarea.'
    }
  }
 
  </script>
  