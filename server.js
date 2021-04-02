const app = require("./app");
const PORT = 3001;
//START SERVER
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
