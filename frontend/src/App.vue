<script setup>
import { onMounted, ref, watch, provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const users = ref([])

const selectedUserId = ref(
  localStorage.getItem('selectedUserId') || ''
)

// to use inject in other files
provide('selectedUserId', selectedUserId)

//for the refreach
watch(selectedUserId, (newUserId) => {
localStorage.setItem('selectedUserId', newUserId)
})

onMounted(async () => {
  const response = await fetch('http://localhost:5000/api/users')
  users.value = await response.json()
})
</script>



<template>
  <header>
    <h1>EventHub</h1>

    <nav>
      <RouterLink to="/">Events</RouterLink>
      <RouterLink to="/events/create">Create Event</RouterLink>
    </nav>
  </header>


	<div>
	<label for="user-select">Logged in as: </label>

	<select id="user-select" v-model="selectedUserId">
		<option value="">Select user</option>

		<option
		v-for="user in users"
		:key="user._id"
		:value="user._id"
		>
		{{ user.name }}
		</option>
	</select>
	</div>

  <main>
    <RouterView />
  </main>
</template>