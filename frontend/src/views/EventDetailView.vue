<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedUserId = inject('selectedUserId')
const attendees = ref([])
const event = ref(null)
const message = ref('')

async function loadAttendees() {
  const attendeesResponse = await fetch(
    `http://localhost:5000/api/events/${route.params.id}/attendees`
  )

  attendees.value = await attendeesResponse.json()
}

onMounted(async () => {
  const response = await fetch(`http://localhost:5000/api/events/${route.params.id}`)
  const data = await response.json()

  event.value = data


	await loadAttendees()

attendees.value = await attendeesResponse.json()

})

const ticketCount = ref(1)

async function registerForEvent() {
  const response = await fetch(
    `http://localhost:5000/api/events/${route.params.id}/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: selectedUserId.value,
        ticketCount: ticketCount.value,
      }),
    }
  )

  const data = await response.json()
	if (!response.ok) {
		message.value = data.message
		return
	}

	message.value = 'Registration successful'
	await loadAttendees()

	  console.log(data)
}
</script>

<template>
  <section v-if="event">
    <h2>{{ event.title }}</h2>

    <p>{{ event.description }}</p>

    <p>
      <strong>Date:</strong>
      {{ event.startsAt }}
    </p>

    <p>
      <strong>Price:</strong>
      {{ event.price }}
    </p>

    <p>
      <strong>Venue:</strong>
      {{ event.venue?.name }}
    </p>

    <p>
      <strong>Organizer:</strong>
      {{ event.organizer?.name }}
    </p>

    <p>
      <strong>Categories:</strong>
      {{ event.categories?.join(', ') }}
    </p>
  </section>

  <p v-else>Loading...</p>


  <h3>Attendees</h3>

	<ul v-if="attendees.length">
	<li
		v-for="registration in attendees"
		:key="registration._id">

		{{ registration.user.name }}
		— {{ registration.ticketCount }} ticket(s)
	</li>
	</ul>

	<p v-else>No attendees yet.</p>


	<div>
  <label>
    Tickets:
    <input
      v-model.number="ticketCount"
      type="number"
      min="1"
    />
  </label>

  <button
    @click="registerForEvent"
    :disabled="!selectedUserId"
  >
    Register
  </button>
  <p v-if="message">
  {{ message }}
</p>
</div>
</template>