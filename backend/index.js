import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import User from "./models/User.js";
import userRoutes from "./routes/userRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import Registration from "./models/Registration.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
const PORT = process.env.PORT;
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/stats", statsRoutes);

async function startServer() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("DB connected");

		// const user = await User.create({name:"heba", email:"hiba@example.com"});
		// console.log("User created:", user);

		app.listen(PORT, () => {
		console.log(`server is listening in port ${PORT}`);
		});
	}
	 catch (error) {
		console.error("MongoDB connection failed:", error.message);
	}
}

startServer();

app.get("/api/health", (req,res) => {
	res.json({message: "api is running"});
});

console.log("HI fron backend");
