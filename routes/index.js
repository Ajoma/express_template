var express = require("express");
var router = express.Router();
var rg = require("random-greetings");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Travel Experts INC.",
    greeting: rg.greet(),
  });
});

/* GET contact page. */
router.get("/contact", function (req, res, next) {
  res.render("contact");
});

/* GET thankyou page page. */
router.get("/thankyou", function (req, res, next) {
  console.log(
    "Thank you for registering with us. We aim to respond to you as soon as possible."
  );
  res.render("thankyou");
});
module.exports = router;
