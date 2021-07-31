// Require the mongoose module
var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const contactSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: "First name is required.",
    trim: true,
    unique: "The First name must be unique.",
  },
  lname: {
    type: String,
    required: "Last name is required..",
    trim: true,
  },

  email: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Email address.`,
    },
    required: "Please enter your email.",
  },

  comment: {
    type: String,
    required:
      "Please enter a comment or question, so we can attend to you effectively",
    trim: true,
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // more fields defined below
  role: {
    type: String,
    trim: true,
    default: "customer",
  },
});

contactSchema.plugin(uniqueValidator);
module.exports.Contact = mongoose.model("Contact", contactSchema);
