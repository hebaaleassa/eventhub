import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Venue from "../models/Venue.js";


import Registration from "../models/Registration.js";
import mongoose from "mongoose";

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {

	const {q, category, city} = req.query;
	const filter = {};
	// search by name or description, i --> for case-insensitive،
	if (q)
	{
		filter.$or = [
			{ name: { $regex: q, $options: "i" } },
			{ description: { $regex: q, $options: "i" } }
		];
	}
	if (category)
		filter.categories  = category;
	if (city)
	{
		const venuesInCity = await Venue.find({ city: city });
		const venueIds = venuesInCity.map(venue => venue._id);
		filter.venue = { $in: venueIds };
	}
		// filter.venue.city = city;
	const events = await Event.find(filter).populate("venue").populate("organizer");
	res.json(events);
});

router.get("/:id", async (req, res) => {

	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id))
			return res.status(400).json({ message: "Invalid event ID" });
		
		const event = await Event.findById(req.params.id).populate("venue").populate("organizer");
		if (!event)
			res.status(404).json({ message: "Event not found" });
		else 
			res.json(event);
	}

	catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//add a new event
router.post("/", async (req, res) => {
	try
	{	
		const event = await Event.create(req.body);
		res.status(201).json(event);
	}
	catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//add the user registration to the event
router.post("/:id/register", async (req, res) => {
	try
	{
		if (!mongoose.Types.ObjectId.isValid(req.params.id))
			return res.status(400).json({ message: "Invalid event ID" });
		// Check if the event exists
		const event = await Event.findById(req.params.id).populate("venue");
		if (!event)
			return res.status(404).json({ message: "Event not found" });
		//save the userID and the ticketCount
		const { userId, ticketCount} = req.body;
		const user = await User.findById(userId);
		if (!user)
			return res.status(404).json({ message: "User not found" });

		if (ticketCount <= 0 || !Number.isInteger(ticketCount))
			return res.status(400).json({ message: "Invalid ticket count" });

		const registrations = await Registration.find({event: event._id});

		const reservedTickets = registrations.reduce(
			(total, registration) => total + registration.ticketCount,0);
		if (reservedTickets + ticketCount > event.venue.capacity)
			return res.status(400).json({ message: "Not enough capacity available" });

		//all good then we create the new registration
		const createdRegistration = await Registration.create({
			user: userId,
			event: event._id,
			ticketCount: ticketCount
		});

		res.status(201).json(createdRegistration);
	}
	catch (error) {
		if (error.code === 11000) 
			return res.status(409).json({ message: "User already registered for this event" });
		res.status(400).json({ message: error.message });
	}
});


router.get("/:id/attendees", async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id))
			return res.status(400).json({ message: "Invalid event ID" });
		// const eventId = req.params.id;
		const event = await Event.findById(req.params.id);
		if (!event)
			return res.status(404).json({ message: "Event not found" });

		const registrations = await Registration.find({ event: req.params.id }).populate("user");
		res.json(registrations);
	}
	catch (error) {
		res.status(400).json({ message: error.message });
	}

});

router.put("/:id", async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id))
			return res.status(400).json({ message: "Invalid event ID" });
		
		const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runsValidators: true });

		if (!event)
			return res.status(404).json({ message: "Event not found" });
		else
			res.json(event);
	}
	catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id))
			return res.status(400).json({ message: "Invalid event ID" });
		
		const event = await Event.findById(req.params.id);
		
		if (!event)
			res.status(404).json({ message: "Event not found" });
		else
		{
			await Registration.deleteMany({ event: req.params.id });
			const event = await Event.findByIdAndDelete(req.params.id);
			res.status(200).json({ message: "Event deleted successfully" });
		}
	}
	catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;