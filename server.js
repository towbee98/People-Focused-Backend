const fs = require("fs");
const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3001;
const jobs = JSON.parse(fs.readFileSync("jobs.json"));

// This get all jobs from the server
app.get("/api/v1/jobs", (req, res) => {
  res.status(200).json({
    status: "success",
    result: jobs.length,
    data: {
      jobs,
    },
  });
});

//this gets a particular job from the server
app.get("/api/v1/jobs/:id", (req, res) => {
  const id = req.params.id * 1;
  const job = jobs.find((el) => el._id === id);
  if (!job) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

//Create a new job and save on the server
app.post("/api/v1/jobs", (req, res) => {
  const newId = jobs.length + 1;
  const newJob = Object.assign({ _id: newId }, req.body);
  jobs.push(newJob);
  fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        newJob,
      },
    });
  });
});

// Update a  particular job
app.patch("/api/v1/jobs/:id", (req, res) => {
  const id = req.params.id * 1;
  if (id > jobs.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  const updatedJob = Object.assign({ _id: id }, req.body);
  jobs.splice(id - 1, 1, updatedJob);
  fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
    res.status(200).json({
      status: "success",
      data: {
        updatedJob,
      },
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
