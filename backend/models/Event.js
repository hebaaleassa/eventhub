import mongoose from "mongoose";


// title, description, startsAt, price, venue, organizer, categories[]
const eventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true},
	description: {
		type: String,
		required: true},
	startsAt: {
		type: Date,
		required: true},
	price: {
		type: Number,
		required: true,
		min: 0},
	
	categories: {
		type: [String],
		required: true},
	venue: {
		// refrence to the venue model
		type: mongoose.Schema.Types.ObjectId,
		ref: "Venue",
		required: true},

	organizer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true}

});

const Event = mongoose.model("Event", eventSchema);
export default Event;