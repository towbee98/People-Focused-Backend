const fs = require("fs");
const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3001;
const jobs = JSON.parse(fs.readFileSync("jobs.json"));

app.get("/api/v1/jobs", (req, res) => {
  res.status(200).json({
    status: "success",
    result: jobs.length,
    data: {
      jobs,
    },
  });
});

app.post("/api/v1/jobs", (req, res) => {
  console.log(req.body);
  const newId = jobs.length + 1;
  console.log(newId);
  res.send("Hello from the server side");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
