import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/Proyectos/HomePage.vue'
import LoginPage from '../views/Auth/LoginPage.vue';
import RegisterPage from '../views/Auth/RegisterPage.vue';
import CreateProject from '../views/Proyectos/CreateProject.vue';
import ProjectDetails from '../views/Proyectos/ProjectDetails.vue';
import TaskEdit from '../views/Tareas/EditTask.vue';
import EditProject from '../views/Proyectos/EditProject.vue'



const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'  // Redirige a /home al acceder a la raíz
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/register',
    component: RegisterPage
  },

  {
    path: '/crear-proyecto',
    name: 'crear-proyecto',
    component: CreateProject,
    meta: { requiresAuth: true } 
  },
  {
    path: '/projects',
    name: 'projects',
    component: HomePage
  },
  {
    path: '/projects/:id', 
    name: 'ProjectDetails',
    component: ProjectDetails, 
    props: true 
  },
  {
    path: '/projects/:id/tasks/create',
    name: 'TaskCreate',
    component: () => import('../views/Tareas/TaskCreate.vue')
  },
  {
    path: '/projects/:projectId/tasks/:taskId/edit',
    name: 'task.edit',
    component: TaskEdit
  },
  {
    path: '/projects/edit/:id',
    name: 'projects.edit',
    component: EditProject,
    props: true
  }
  
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
