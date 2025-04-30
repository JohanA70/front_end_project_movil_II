<template>
  <div class="container py-4">

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb bg-light p-2 rounded shadow-sm">
        <li class="breadcrumb-item active" aria-current="page">Proyectos</li>
      </ol>
    </nav>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark fw-bold">
        <i class="fas fa-folder-open me-2"></i>Gestor de Proyectos
      </h2>
      <button @click="goToCreateProject" class="btn btn-success shadow-sm">
        <i class="fas fa-plus-circle me-1"></i> Nuevo Proyecto
      </button>
    </div>

    <div class="mb-4">
      <input type="text" v-model="searchQuery" class="form-control" @input="searchProjects"
        placeholder="Buscar proyectos por nombre...">
    </div>

    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
      <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>

    <div v-if="projects.length === 0" class="alert alert-info shadow-sm">
      <i class="fas fa-info-circle me-2"></i>
      <span>
        No hay proyectos disponibles. ¡Crea uno nuevo!
      </span>
    </div>

    <div class="row" id="project-list">
      <div v-for="project in projects" :key="project.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 border-0 shadow-sm project-card">
          <div class="card-body d-flex flex-column justify-content-between custom-card">
            <div>
              <h5 class="card-title text-dark d-flex align-items-center">
                <i class="fas fa-project-diagram me-2"></i>{{ project.name }}
              </h5>
              <p class="card-text text-muted">
                {{ project.description || 'Sin descripción.' }}
              </p>
            </div>
            <div class="mt-3 d-flex justify-content-between align-items-center">
              <router-link :to="'/projects/' + project.id" class="btn btn-sm btn-outline-primary"
                aria-label="Ver proyecto">
                <i class="fas fa-eye me-1"></i> Ver Tareas
              </router-link>
              <button @click="editProject(project.id)" class="btn btn-sm btn-outline-warning"
                aria-label="Editar proyecto">
                <i class="fas fa-edit me-1"></i> Editar
              </button>
              <button @click="deleteProject(project.id)" class="btn btn-sm btn-outline-danger"
                aria-label="Eliminar proyecto">
                <i class="fas fa-trash me-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const projects = ref([]);
const searchQuery = ref('');
const successMessage = ref('');

// Funciones
const goToCreateProject = () => {
  router.push('/crear-proyecto')
}

const editProject = (id) => {
  router.push(`/projects/edit/${id}`);
};

const deleteProject = async (id) => {
  const confirmDelete = window.confirm('¿Estás seguro de eliminar este proyecto?');
  if (confirmDelete) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      projects.value = projects.value.filter(p => p.id !== id);
      showSuccessMessage('Proyecto eliminado correctamente.');
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al eliminar el proyecto.');
    }
  }
};

const showSuccessMessage = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};

const searchProjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post(
      'http://127.0.0.1:8000/api/projects/search/by-name',
      {
        name: searchQuery.value,
        user_id: user.id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    projects.value = response.data;
  } catch (error) {
    console.error('Error al buscar proyectos:', error);
  }
};

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');  // Obtén el token del localStorage
    const user = localStorage.getItem('user');
    const id = JSON.parse(user).id;
    const response = await axios.get(`http://127.0.0.1:8000/api/projects/participating/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Asegúrate de enviar el token
      },
    });

    if (Array.isArray(response.data)) {
      projects.value = response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  const token = localStorage.getItem('token');

  // Cargar datos del usuario (para saber si es admin)
  axios.get('http://127.0.0.1:8000/api/user', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      // Cargar los proyectos después de obtener la información del usuario
      fetchData();
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

</script>

<style scoped>
.project-card {
  transition: transform 0.2s ease-in-out;
  border-top: 4px solid #0d6efd;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.custom-card {
  padding: 1.5rem;
}

.card-body {
  background-color: #f9f9f9;
}

.card-title {
  font-size: 1.25rem;
  color: #333;
}

.card-text {
  font-size: 1rem;
  color: #777;
}

.btn-sm {
  font-size: 0.875rem;
}

.row {
  margin-top: 20px;
}
</style>