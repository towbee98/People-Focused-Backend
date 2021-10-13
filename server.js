const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

// const DB = process.env.DATABASE_LOCAL

const start = async () => {
  await mongoose.connect(
    DB,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (err, data) => {
      if (err) {
        console.log(`Error Occured: ${err}`);
      } else {
        console.log("Database connected Successfully");
        return data;
      }
    }
  );
  const PORT = process.env.PORT || 3001;
  // eslint-disable-next-line global-require
  const app = require("./app");

  // START SERVER

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
};

start();
