import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";

import Registration from "../models/Registration.js";
import mongoose from "mongoose";

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
	const events = await Event.find().populate("venue").populate("organizer");
	res.json(events);
});

// GET a specific event by ID
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


//list of attendees for a specific event
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


export default router;