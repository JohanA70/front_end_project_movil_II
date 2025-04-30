<template>
    <div class="container py-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-light p-2 rounded shadow-sm">
          <li class="breadcrumb-item active" aria-current="page">Editar Tarea</li>
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
            <div class="card-header bg-warning text-white fw-bold">
              Editar Tarea - Proyecto: {{ projectName || '...' }}
            </div>
  
            <div class="card-body bg-light">
              <form @submit.prevent="updateTask">
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
                  <button type="submit" class="btn btn-primary px-4">Actualizar</button>
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
  const projectId = route.params.projectId
  const taskId = route.params.taskId
  
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
  
      // Cargar usuarios y proyecto
      const [usersResponse, projectResponse, taskResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://127.0.0.1:8000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
  
      users.value = usersResponse.data
      projectName.value = projectResponse.data.name
  
      // Precargar datos de la tarea
      const tarea = taskResponse.data
      form.value.name = tarea.name
      form.value.description = tarea.description
      form.value.user_id = tarea.user_id
  
    } catch (error) {
      console.error('Error al cargar datos:', error)
      mensaje.value = '❌ No se pudieron cargar los datos.'
    }
  })
  
  const updateTask = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${taskId}`,
        form.value,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      mensaje.value = '✅ Tarea actualizada con éxito.'
      setTimeout(() => {
        router.push(`/projects/${projectId}`)
      }, 1500)
    } catch (error) {
      console.error('Error al actualizar la tarea:', error)
      mensaje.value = '❌ Error al actualizar la tarea.'
    }
  }
  </script>
  