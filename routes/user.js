const express = require("express");
const router = express.Router();
const User = require("../models/Usermodel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");
const { ensureAuth, forwardAuth } = require("../config/auth");

router.get('/about',(req,res)=>{
    res.render('About')
})

router.get("/users/login", (req, res) => {
  res.render("login");
});
router.get("/users/register", (req, res) => {
  res.render("signup");
});

router.get("/Profiles", (req, res) => {
  res.render("Search");
});

router.post("/Profiles", async (req, res) => {
  const user = await User.findOne({ name: req.body.Name });
  if (user) {
    res.render("Profiles", {
      user,
      Name: req.body.name,
    });
  } else {
    res.render("404user") 
  }
});

router.post("/users/register", forwardAuth, async (req, res) => {
  try {
    const { passwordrepeat, password } = req.body;
    const user = await User.findOne({ email: req.body.email });
    const errors = [];
    if (password !== passwordrepeat)
      errors.push({ msg: "Password doesnt match" });
    if (req.body.password.length < 6)
      errors.push({ msg: "Password should be greater than 6" });
    if (user) {
      req.flash("error_msg", "User Already Exists, Please Login");
      return res.redirect("login");
    }
    if (errors.length > 0)
      return res.render("signup", {
        errors,
      });

    userdata = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      skills: req.body.skills,
      education: req.body.Education,
      Bio: req.body.bio,
    });
    //Bcrypt
    const salt = await bcrypt.genSalt(10);
    userdata.password = await bcrypt.hash(password, salt);
    await userdata.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cygnusuvce@gmail.com",
        pass: "cygnus0210", // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const mailOptions = {
      from: "cygnusuvce@gmail.com",
      to: req.body.email,
      subject: "Hey There" + " " + req.body.username,
      text: "Thanks For Registering,You are now a part of our community,We always respect your privacy",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    req.flash("success_msg", "You Are registered and can login");
    res.redirect("login");
  } catch (err) {
    console.log(err);
  }
});

router.post("/users/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/users/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
