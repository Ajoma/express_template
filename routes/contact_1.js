var express = require("express");
var router = express.Router();
const Contact = require("../models/contact").Contact;
// const { User } = require("../models/user");
// const bcrypt = require("bcryptjs");

/* GET all contacts listing. */
router.get("/", function (req, res, next) {
  Contact.find()
    .populate("user") //This populates the user id with actual user information!
    .exec(function (err, contacts) {
      if (err) throw err;
      res.render("blog", { blogContacts: contacts });
    });
});

// Show all contacts for given username
router.get("/auth/:uname", function (req, res, next) {
  // Using the given username paramter, find the user(auth0r) object from the DB
  // Use the user _id from the user object, to find all posts for the _id
  Contact.findOne({ username: req.params.uname }, (err, author) => {
    if (err) return processErrors(err, "blog", req, res);
    Contact.find({ user: author._id }, (err, posts) => {
      if (err) return processErrors(err, "blog", req, res);
      res.render("blog-author", {
        user: author.username,
        blogContacts: contacts,
      });
    });
  });
});
const contactRegister = {
  contacttitle: "contactform",
  contactheading: "Enter your queries in the form provided",
  contactmessage: "Please enter the required information to submit your form.",
  hideLogin: true,
};

const pageShowPosts = {
  contacttitle: "Blog posts",
  contactheading: "List all posts",
  contactmessage: "These are all posts.",
};

/* GET contact form page. */
router.get("/form", function (req, res, next) {
  res.render("form", contactRegister);
});

// To receive a new contact info
router.post("/form", function (req, res, next) {
  // const post = new Post(req.body);
  const contact = new Contact();
  contact.fname = req.body.fname;
  contact.lname = req.body.lname;
  contact.email = req.body.email;
  contact.comment = req.body.comment;
  contact.user = req.user._id;
  contact.save((err) => {
    // if(err) throw err;
    if (err) {
      const errorArray = [];
      const errorKeys = Object.keys(err.errors);
      errorKeys.forEach((key) => errorArray.push(err.errors[key].message));
      return res.render("contact", {
        contactdata: req.body,
        errors: errorArray,
      });
    }
    req.session.msg = `Thank you for contacting us, ${req.user.fname}`;
    res.redirect("/contact");
  });
});

// Shows a single contact form
router.get("/:comment", function (req, res, next) {
  const contactcomment = req.params.comment;
  Contact.findOne({ contactcomment: contactcomment }, (err, contact) => {
    res.render("blog-contact", { blogContact: contact });
  });
});
module.exports = router;
