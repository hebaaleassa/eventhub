import express from "express";
import Registration from "../models/Registration.js";



/**
 * 
 * from Registration model --> Event model --> Venue model
 * 
 */

const router = express.Router();

router.get("/top-venues", async (req, res) => {
	const result = await Registration.aggregate([
		{
			$lookup: {
				from: "events",
				localField: "event",
				foreignField: "_id",
				as: "eventData"
			}
		},
		{
			$unwind: "$eventData"
		},
		{
			$group: {
			_id: "$eventData.venue",
			registrationCount: { $sum: 1 }
			}
		},
		{
			$sort: {
			registrationCount: -1
			}
		},
		{
			$limit: 5
		},

		{
			$lookup: {
				from: "venues",
				localField: "_id",
				foreignField: "_id",
				as: "venueData"
			}
		},
		{
			$unwind: "$venueData"
		},

		{
			$project: {
				_id: 0,
				venueId: "$venueData._id",
				name: "$venueData.name",
				city: "$venueData.city",
				registrationCount: 1
			}
		}
	]);

	res.json(result);
});



export default router;