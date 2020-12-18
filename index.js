const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const port = process.env.PORT || 5000;
require("dotenv").config();
const passport = require("passport");
const logger = require("./configs/winston");
const relations = require("./utils/relations");
const round0Route = require("./routes/round0");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const amcRoute = require("./routes/amc");
const authRoute = require("./routes/authentication");

const app = express();
app.use(
  express.json({
    extended: false,
  })
);

app.use(cors());
app.use(helmet());
app.use(morgan("common", { stream: logger.stream }));
app.use(express.static(path.resolve("public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.png")));

app.use(passport.initialize());

const userAuthMiddleware = passport.authenticate("userStrategy", {
  session: false,
});
const adminAuthMiddleware = passport.authenticate("adminStrategy", {
  session: false,
});

app.use("/api/user", userAuthMiddleware, userRoute);
app.use("/api/r0", userAuthMiddleware, round0Route);
// app.use("/api/r1", userAuthMiddleware, round1Route);
// app.use("/api/r2", userAuthMiddleware, round2Route);
app.use("/api/admin", adminAuthMiddleware, adminRoute);
app.use("/api/admin/amc", adminAuthMiddleware, amcRoute);

app.use("/api", authRoute);

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/verified.html"));
  // res.json({ success: true, status: "Runnning" });
});

relations()
  .sync({ force: false, logging: false })
  .then(() => {
    logger.info("Success connection to db");
    app.listen(port, () => logger.info(`Server running on port ${port}`));
  })
  .catch((err) => {
    logger.error(`Failure to connect to db due to ${err}`);
  });
