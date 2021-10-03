const express = require("express");
const app = express();
const connectDB = require("./config/database");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
connectDB();
const PORT = process.env.PORT || 5000;
require("./config/passport")(passport);
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(require("./routes/index"));
app.use(require("./routes/user"));

app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
