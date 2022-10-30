const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const cors = require("cors");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

app.use(cors());
const mongourl =
  "mongodb+srv://ninegap:ninegap@cluster0.ejkhsmy.mongodb.net/?retryWrites=true&w=majority";
const JWT_SECRET = "jdjhwonfpuewjbdskhdskhajgjh";
mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connected to the database"))
  .catch((e) => console.log(e));

require("./userData");
const User = mongoose.model("UserInfo");

app.post("/v1/register", async (req, res) => {
  const { firstName, lastName, profilePhoto, email, password } = req.body;
  const encryptedPassword = await bycrypt.hash(password, 10);
  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.send({ error: "User Exist with the same email" });
    }
    await User.create({
      firstName,
      lastName,
      profilePhoto,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "Ok" });
  } catch (err) {
    res.send({ status: "Error" });
  }
});
// -----------

app.post("/v1/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bycrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});
// ------------------
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});
// -----------------

app.listen(5000, () => {
  console.log("server started");
});
app.get("/google", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
