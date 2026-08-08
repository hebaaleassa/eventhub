import express from "express";
import Venue from "../models/Venue.js";

const router = express.Router();

router.get("/", async (req, res) => {
	  const venues = await Venue.find();
	  res.json(venues);
});

export default router;