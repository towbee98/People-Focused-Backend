const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const jobs = JSON.parse(fs.readFileSync("jobs.json"));

//ROUTE HANDLERS
const getAllJobs = (req, res) => {
  res.status(200).json({
    status: "success",
    requestMadeAt: req.requestTime,
    result: jobs.length,
    data: {
      jobs,
    },
  });
};

const getJob = (req, res) => {
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
    requestMadeAt: req.requestTime,
    data: {
      job,
    },
  });
};

const postAJob = (req, res) => {
  const newId = jobs.length + 1;
  const newJob = Object.assign({ _id: newId }, req.body);
  jobs.push(newJob);
  fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
    res.status(201).json({
      status: "success",
      requestMadeAt: req.requestTime,
      data: {
        newJob,
      },
    });
  });
};

const updateJob = (req, res) => {
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
      requestMadeAt: req.requestTime,
      data: {
        updatedJob,
      },
    });
  });
};

const deleteJob = (req, res) => {
  const id = req.params.id * 1;
  const job = jobs.find((el) => el._id === id);
  if (job) {
    jobs.splice(job._id - 1, 1);
    fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
      return res.status(204).json({
        status: "success",
        requestMadeAt: req.requestTime,
        data: null,
      });
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
};

//ROUTES
app.route("/api/v1/jobs").get(getAllJobs).post(postAJob);
app.route("/api/v1/jobs/:id").get(getJob).patch(updateJob).delete(deleteJob);

//START SERVER
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
