import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },

  ticketCount: {
    type: Number,
    required: true,
    min: 1
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

/**
 * this is the "compound unique index", we make the unique combination of user and event,
 *  so that a user can only register for an event once. but also for more than one.
 */
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;