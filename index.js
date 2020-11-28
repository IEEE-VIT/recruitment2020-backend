const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const port = process.env.port || 5000;
require("dotenv").config();
const passport = require("passport");
const relations = require("./utils/relations");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const amcRoute = require("./routes/amc");
const round0Route = require("./routes/round0");
const round1Route = require("./routes/round1");
const round2Route = require("./routes/round2");
const authRoute = require("./routes/authentication");

const app = express();
app.use(
  express.json({
    extended: false,
  })
);

app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use(passport.initialize());

const userAuthMiddleware = passport.authenticate("userStrategy", {
  session: false,
});
const adminAuthMiddleware = passport.authenticate("adminStrategy", {
  session: false,
});

app.use("/api", userRoute);
app.use("/api/r0", userAuthMiddleware, round0Route);
app.use("/api/r1", userAuthMiddleware, round1Route);
app.use("/api/r2", userAuthMiddleware, round2Route);

app.use("/api/admin", adminAuthMiddleware, adminRoute);
app.use("/api/admin/amc", adminAuthMiddleware, amcRoute);

app.use("/api", authRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

relations()
  .sync({ force: false, logging: false })
  .then(() => {
    console.log("Success connection to db");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.log(`Failure to connect to db due to ${err}`);
  });
