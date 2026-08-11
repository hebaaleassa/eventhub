import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import EventsView from '../views/EventsView.vue'
import EventDetailView from '../views/EventDetailView.vue'
import CreateEventView from '../views/CreateEventView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'events',
      component: EventsView,
    },
     {
      path: '/events/:id',
      name: 'event-detail',
      component: EventDetailView,
    },
    {
      path: '/events/create',
      name: 'create-event',
      component: CreateEventView,
    },
  ],
})

export default router
