<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const events = ref([])
const venues = ref([])

const search = ref('')
const city = ref('')
const category = ref('')

const loading = ref(false)
const error = ref('')

const categories = [
  'Technology',
  'Conference',
  'Innovation',
  'Workshop',
  'Backend',
]

async function loadEvents() {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()

    if (search.value) params.set('q', search.value)
    if (city.value) params.set('city', city.value)
    if (category.value) params.set('category', category.value)

    const response = await fetch(
      `http://localhost:5000/api/events?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error('Failed to load events')
    }

    events.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function loadVenues() {
  const response = await fetch('http://localhost:5000/api/venues')
  venues.value = await response.json()
}

onMounted(async () => {
  await loadVenues()
  await loadEvents()
})
</script>

<template>
  <section>
    <h2>Events</h2>

    <form @submit.prevent="loadEvents">
      <input
        v-model="search"
        type="text"
        placeholder="Search events"
      />

      <select v-model="city">
        <option value="">All cities</option>

        <option
          v-for="venue in venues"
          :key="venue._id"
          :value="venue.city"
        >
          {{ venue.city }}
        </option>
      </select>

      <select v-model="category">
        <option value="">All categories</option>

        <option
          v-for="item in categories"
          :key="item"
          :value="item"
        >
          {{ item }}
        </option>
      </select>

      <button type="submit">Search</button>
    </form>

    <p v-if="loading">Loading events...</p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <p v-else-if="events.length === 0">
      No events found.
    </p>

    <div v-else>
      <article
        v-for="event in events"
        :key="event._id"
      >
        <h3>
          <RouterLink :to="`/events/${event._id}`">
            {{ event.title }}
          </RouterLink>
        </h3>

        <p>{{ event.description }}</p>
        <p>{{ event.venue?.name }} — {{ event.venue?.city }}</p>
        <p>Price: {{ event.price }}</p>
        <p>{{ event.categories?.join(', ') }}</p>
      </article>
    </div>
  </section>
</template>