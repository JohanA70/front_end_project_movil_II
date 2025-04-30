<template>
  <div class="container py-4">
    <nav class="breadcrumb bg-light p-2 rounded shadow-sm">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item active">
          Tareas para Asignar
        </li>
      </ol>
    </nav>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <router-link to="/projects" class="btn btn-outline-secondary shadow">⬅️ Volver</router-link>

      <h2 class="text-dark fw-bold">
        <i class="fas fa-folder-open me-2"></i>Tablero de Tareas
      </h2>

      <router-link :to="`/projects/${projectId}/tasks/create`" class="btn btn-success shadow">
        ➕ Crear Nueva Tarea
      </router-link>

    </div>

    <div class="row" id="task-board">
      <div v-for="(column, key) in columns" :key="key" class="col-md-4">
        <div :class="['card', 'border-' + column.color, 'shadow-sm', 'mb-4']">
          <div
            :class="['card-header', 'bg-' + column.color, 'text-white', 'd-flex', 'justify-content-between', 'align-items-center']">
            <span class="fw-bold">{{ column.label }}</span>
            <span class="badge bg-light text-dark">{{ column.tasks.length }}/{{ column.max }}</span>
          </div>
          <div class="card-body bg-light" :id="key" :data-status="column.status" :data-max="column.max">
            <div v-for="task in column.tasks" :key="task.id" class="card mb-2 task-item shadow-sm border-start border-3"
              :class="{ [`border-${column.color}`]: true }" :data-id="task.id">
              <div class="card-body p-2 position-relative">
                <button class="btn btn-sm btn-danger px-2 py-0 position-absolute top-0 end-0 m-1"
                  @click="deleteTask(task.id)">
                  &times;
                </button>

                <strong class="text-dark">{{ task.name }}</strong><br />
                <small class="text-muted">{{ task.description }}</small>

                <div class="d-flex justify-content-between align-items-center mt-2">
                  <router-link :to="`/projects/${task.project_id}/tasks/${task.id}/edit`"
                    class="btn btn-outline-primary btn-sm d-flex align-items-center px-2 py-1">
                    <i class="fas fa-edit me-1"></i> Editar
                  </router-link>
                  <span class="ms-2">
                    <i class="fas fa-user-circle text-primary fs-5" title="Usuario: {{ task.user.name }}"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Sortable from 'sortablejs'

const route = useRoute()
const projectId = route.params.id
const tasks = ref([])

const columns = ref({
  pending: { label: '🕐 Pendiente', status: 'Pending', max: 200, color: 'warning', tasks: [] },
  in_progress: { label: '🚧 En Progreso', status: 'In Progress', max: 200, color: 'info', tasks: [] },
  completed: { label: '✅ Completada', status: 'Completed', max: 200, color: 'success', tasks: [] },
})

const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/tasks`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
    const data = await res.json()
    tasks.value = Array.isArray(data) ? data : []
    distributeTasks()
  } catch (err) {
    console.error('Error al obtener tareas:', err)
  }
}

const deleteTask = async (id) => {
  if (!confirm('¿Eliminar esta tarea?')) return

  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })

    if (!res.ok) throw new Error('Error eliminando tarea')
    await fetchTasks()
  } catch (err) {
    console.error('Error al eliminar:', err)
  }
}

const setupSortable = () => {
  Object.keys(columns.value).forEach((key) => {
    const column = document.getElementById(key)
    if (column) {
      Sortable.create(column, {
        group: 'shared',
        animation: 150,
        onEnd: async (evt) => {
          const taskId = parseInt(evt.item.dataset.id)
          const newStatus = evt.to.dataset.status

          const task = tasks.value.find(t => t.id === taskId)

          // Si no cambió de estado, no hacer nada
          if (task.status === newStatus) return

          try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) {
              throw new Error('No se pudo actualizar la tarea')
            }

            // Actualizar localmente el status
            task.status = newStatus

            // Actualizar distribución local sin recargar desde la API
            distributeTasks()

          } catch (err) {
            console.error(err)
            alert('❌ Error al mover la tarea')
          }
        },
      })
    }
  })
}

const distributeTasks = () => {
  // Reiniciar tareas de todas las columnas
  Object.values(columns.value).forEach(col => col.tasks = [])
  tasks.value.forEach(task => {
    const key = Object.keys(columns.value).find(k => columns.value[k].status === task.status)
    if (key) columns.value[key].tasks.push(task)
  })
}

onMounted(async () => {
  await fetchTasks()
  distributeTasks()
  setupSortable()
})
</script>