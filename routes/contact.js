var express = require("express");
var router = express.Router();
const Contact = require("../models/contact").Contact;
// const { User } = require("../models/user");
// const bcrypt = require("bcryptjs");

/* GET all contacts listing. */
router.get("/blog-contacts", function (req, res, next) {
  const fname = req.session.fname;
  const lname = req.session.lname;
  const email = req.session.email;
  const comment = req.session.comment;
  Contact.find()
    .populate("user") //This populates the user id with actual user information!
    .exec(function (err, contacts) {
      if (err) throw err;
      res.render("blog-contacts", { fname, lname, email, comment });
      // res.render("blog-contacts", { blogContacts: contacts });
    });
});

// Show all contacts for given username
router.get("/auth/:uname", function (req, res, next) {
  // Using the given username paramter, find the user(auth0r) object from the DB
  // Use the user _id from the user object, to find all posts for the _id
  Contact.findOne({ username: req.params.uname }, (err, author) => {
    if (err) return processErrors(err, "blog-contacts", req, res);
    Contact.find({ user: author._id }, (err, posts) => {
      if (err) return processErrors(err, "blog-contacts", req, res);
      res.render("blog-author", {
        user: author.username,
        blogContacts: contacts,
      });
    });
  });
});

// middleware that is specific to this router,
// checks that the user must be logged in
router.use((req, res, next) => {
  //console.log('Time: ', Date.now());
  if (!req.user) res.status(403).redirect("/");
  //else if (req.user.role != "agent") res.status(403).redirect("/");
  else next();
});

function processErrors(errs, pageTemplate, req, res) {
  // If there are errors from the Model schema
  const errorArray = [];
  const errorKeys = Object.keys(errs.errors);
  errorKeys.forEach((key) => errorArray.push(errs.errors[key].message));
  return res.render(pageTemplate, {
    ...pageRegister,
    errors: errorArray,
    ...req.body,
  });
}
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

/* show the  contact form page. */
router.get("/form", function (req, res, next) {
  res.render("contact", contactRegister);
});

// To make a new contact info
router.post("/", function (req, res, next) {
  // const post = new Post(req.body);
  const contact = new Contact();
  contact.fname = req.body.fname;
  contact.lname = req.body.lname;
  contact.email = req.body.email;
  contact.comment = req.body.comment;
  console.log(req.body.fname);
  console.log(req.body.lname);
  console.log(req.body.email);
  console.log(req.body.comment);
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
    // req.session.msg = `Thank you for contacting us, ${req.user.fname}`;
    req.session.fname = req.body.fname;
    req.session.lname = req.body.lname;
    req.session.email = req.body.email;
    req.session.comment = req.body.comment;
    res.redirect(
      "/contact/blog-contacts"
      // "/contact" + `?msg=Thank you for contacting us,` + req.user.fname
    );
  });
});

// Shows a single contact form
router.get("/:comment", function (req, res, next) {
  const contactcomment = req.params.comment;
  Contact.findOne({ contactcomment: contactcomment }, (err, contact) => {
    res.render("blog-post", { blogContact: contact });
  });
});
module.exports = router;
