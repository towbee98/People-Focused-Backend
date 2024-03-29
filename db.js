const mongoose = require("mongoose");

connectToDB = async (DB) => {
  try {
    await mongoose.connect(DB, {
      useUnifiedTopology: true,
      
    });
    console.log("Database connected succesfully");
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      return console.log("Error connecting to the database");
    }
    console.log(err);
  }
};
module.exports = connectToDB;
