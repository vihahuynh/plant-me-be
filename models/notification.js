const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  url: String,
  type: {
    type: String,
    default: "order",
    trim: true,
    lowercase: true
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

notificationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
