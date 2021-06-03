const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Jobs = require("./models/jobModel");
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
//const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connected Successfully!!");
  })
  .catch((err) => {
    console.log(err);
  });

const alljob = JSON.parse(fs.readFileSync(`${__dirname}/jobs.json`));

const importData = async (alljob) => {
  try {
    await Jobs.insertMany(alljob);
    console.log("Data Succesfully uploaded");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Jobs.deleteMany();
    console.log("Data Successfully deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

console.log(process.argv);

if (process.argv[2] == "--import") {
  importData(alljob);
} else if (process.argv[2] == "--delete") {
  deleteData();
}
