const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const path = require("path");
const ioServer = require("socket.io");

const MONGODB_URI =
  "mongodb://localhost:27017/testAngularckc";

const PORT = 4100;
const httpsOptions = {
  key: fs.readFileSync("security/localhost.key"),
  cert: fs.readFileSync("security/localhost.crt"),
};

const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log("Backend API running at port " + PORT);
});

//#region Socket.io
const io = new ioServer(server);
//#endregion

// Connect with MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose conection error:" + err);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connected!");
});

// enable CORS
app.use(cors());

// Make sure you place body-parser before your CRUD handlers!
app.use(
  bodyParser.urlencoded({
    parameterLimit: 10000, // 413 Payload Too Large
    limit: "50mb", // Fixed 413 Payload Too Large
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(morgan("dev"));

// public images
app.use("/uploads/cntt", express.static(path.join(__dirname, "uploads/cntt")));

app.use("/api", require("./api/api")(io));

app.get("/", (req, res) => {
  res.send("Back end API");
});

//#region Socket.io
var numUsers = 0;
// khởi tạo kết nối socket
io.on("connection", function (socket) {
  ++numUsers;
  console.log("a socket connected.", numUsers);
  // io.emit("ThongBaoKhanCap", "hello world 1"); // main namespace
  socket.on("disconnect", function () {
    --numUsers;
    console.log("a socket disconnected.");
  });
});
//#endregion
