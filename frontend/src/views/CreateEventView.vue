<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const venues = ref([])
const users = ref([])

const title = ref('')
const description = ref('')
const startsAt = ref('')
const price = ref(0)
const venue = ref('')
const organizer = ref('')
const categories = ref('')

const loading = ref(false)
const error = ref('')

onMounted(async () => {
  try {
	const venuesResponse = await fetch('http://localhost:5000/api/venues')
	const usersResponse = await fetch('http://localhost:5000/api/users')

	venues.value = await venuesResponse.json()
	users.value = await usersResponse.json()
  } catch (err) {
	error.value = 'Failed to load users or venues'
  }
})

async function createEvent() {
  error.value = ''

  try {

	const response = await fetch('http://localhost:5000/api/events', {
	  method: 'POST',

	  headers: {
		'Content-Type': 'application/json',
	  },

	  body: JSON.stringify({
		title: title.value,
		description: description.value,
		startsAt: startsAt.value,
		price: price.value,

		venue: venue.value,
		organizer: organizer.value,
		categories: categories.value
		  .split(',')
		  .map((category) => category.trim())
		  .filter(Boolean),
	  }),
	})

	const data = await response.json()



	// 400 , 404 
	if (!response.ok) {
	  throw new Error(data.message || 'Failed to create event')
	}

	router.push(`/events/${data._id}`)
  } 
 	//server off 
  catch (err) {
	error.value = err.message
  }
}
</script>

<template>
  <section>
	<h2>Create Event</h2>

	<form @submit.prevent="createEvent">
	  <div>
		<label>Title</label>
		<input v-model="title" type="text" required />
	  </div>

	  <div>
		<label>Description</label>
		<textarea v-model="description" required></textarea>
	  </div>

	  <div>
		<label>Date and time</label>
		<input v-model="startsAt" type="datetime-local" required />
	  </div>

	  <div>
		<label>Price</label>
		<input v-model.number="price" type="number" min="0" required />
	  </div>

	  <div>
		<label>Venue</label>

		<select v-model="venue" required>
		  <option value="">Select venue</option>

		  <option
			v-for="item in venues"
			:key="item._id"
			:value="item._id"
		  >
			{{ item.name }} — {{ item.city }}
		  </option>
		</select>
	  </div>

	  <div>
		<label>Organizer</label>

		<select v-model="organizer" required>
		  <option value="">Select organizer</option>

		  <option
			v-for="user in users"
			:key="user._id"
			:value="user._id"
		  >
			{{ user.name }}
		  </option>
		</select>
	  </div>

	  <div>
		<label>Categories</label>

		<input
		  v-model="categories"
		  type="text"
		  placeholder="Technology, Workshop"
		/>
	  </div>

	  <p v-if="error">
		{{ error }}
	  </p>

	  <button type="submit" :disabled="loading">
		{{ loading ? 'Creating...' : 'Create Event' }}
	  </button>
	</form>
  </section>
</template>