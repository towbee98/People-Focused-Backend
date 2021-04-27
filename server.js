const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

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

const app = require("./app");
const PORT = process.env.PORT || 3001;

//START SERVER
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
