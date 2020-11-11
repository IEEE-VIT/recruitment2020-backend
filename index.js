const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const port = process.env.port || 5000;
require("dotenv").config();
const relations = require("./utils/relations");

const app = express();
app.use(
  express.json({
    extended: true,
  })
);

app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

relations()
  .sync({ force: true, logging: false })
  .then(() => {
    console.log("Success connection to db");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.log(`Failure to connect to db due to ${err}`);
  });
