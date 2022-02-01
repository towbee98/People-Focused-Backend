const mongoose = require("mongoose");
const dotenv = require("dotenv");
//const http= require("http");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception , Shutting Down... ");
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// const DB = process.env.DATABASE_LOCAL

const PORT = process.env.PORT || 3001;

// eslint-disable-next-line global-require
const app = require("./app");

// START SERVER
const server = app.listen(PORT, async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  console.log("Database connected succesfully");
  console.log(`Server running at port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection , Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
