import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Venue from "./models/Venue.js";
import Event from "./models/Event.js";
import Registration from "./models/Registration.js";

async function addingUsers() {
	const users = await User.insertMany([
		{name: "Heba", email: "heba@gmail.com"},
		{name: "tala", email: "tala@gmail.com"},
		{name: "dina", email: "dina@gmail.com"}
	])

	console.log("Users added:", users);
	return users;
}

async function addingVenues() {
	const venues = await Venue.insertMany([
	{
		name: "Amman Tech Hub",
		city: "Amman",
		address: "Zahran Street",
		capacity: 100
	},
	{
		name: "Innovation Center",
		city: "Amman",
		address: "University Street",
		capacity: 60
	},
	{
		name: "Irbid Events Hall",
		city: "Irbid",
		address: "City Center",
		capacity: 80
	}
	]);

	console.log("Venues added:", venues);
	return venues;
}

async function addingEvents(venues, users) {
	const events = await Event.insertMany([
		{
			title: "Tech Conference",
			description: "A conference for tech enthusiasts",
			startsAt: new Date("2026-08-25T19:00:00"),
			price: 10,
			categories: ["Technology", "Conference"],
			venue: venues[0]._id,
			organizer: users[0]._id
		},
		{
			title: "Innovation Workshop",
			description: "A workshop on innovation and entrepreneurship",
			startsAt: new Date("2026-08-20T10:00:00"),
			price: 15,
			categories: ["Innovation", "Workshop"],
			venue: venues[1]._id,
			organizer: users[1]._id
		}
	]);

	console.log("Events added:", events);
	return events;
}

async function addingRegistrations(users, events) {
	const registrations = await Registration.insertMany([
		{
			user: users[0]._id,
			event: events[0]._id,
			ticketCount: 2
		},
		{
			user: users[1]._id,
			event: events[1]._id,
			ticketCount: 1
		}
	]);

	console.log("Registrations added:", registrations);
	return registrations;
}

async function seedDatabase() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("DB connected");

		//to delete the old data, to not get error of duplicate.
		await Registration.deleteMany({});
		await Event.deleteMany({});
		await Venue.deleteMany({});
		await User.deleteMany({});

		// adding data
		const users = await addingUsers();
		const venues = await addingVenues();
		const events = await addingEvents(venues, users);
		const registrations = await addingRegistrations(users, events);

		await mongoose.disconnect();

	}
	 catch (error) {
		console.error("MongoDB connection failed:", error.message);
	}
}

seedDatabase();