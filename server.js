const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Grid = require("gridfs-stream");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception , Shutting Down... ");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
//const DB = process.env.DATABASE_LOCAL;

exports.Conn = mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => {
    // console.log(res.connection);
    console.log("Database Connected Successfully!!");
    return res.connection.once("open", () => {
      const gfs = Grid(res.connection.db, mongoose.mongo);
      gfs.collection("applications");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const app = require("./app");
const PORT = process.env.PORT || 3001;

//START SERVER
const server = app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection , Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
