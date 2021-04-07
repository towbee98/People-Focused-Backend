const fs = require("fs");
const { title } = require("process");
const jobs = JSON.parse(fs.readFileSync("jobs.json"));

//ROUTE HANDLERS
exports.checkID = (req, res, next, val) => {
  const id = req.params.id * 1;
  const job = jobs.find((el) => el._id === id);
  if (!job) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const { title, Location } = req.body;
  if (!title || !Location) {
    return res.status(400).json({
      status: "fail",
      message: `Please add a valid title and location of the job`,
    });
  }
  next();
};
exports.getAllJobs = (req, res) => {
  res.status(200).json({
    status: "success",
    requestMadeAt: req.requestTime,
    result: jobs.length,
    data: {
      jobs,
    },
  });
};

exports.getJob = (req, res) => {
  const id = req.params.id * 1;
  const job = jobs.find((el) => el._id === id);

  res.status(200).json({
    status: "success",
    requestMadeAt: req.requestTime,
    data: {
      job,
    },
  });
};

exports.postAJob = (req, res) => {
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

exports.updateJob = (req, res) => {
  const id = req.params.id * 1;
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

exports.deleteJob = (req, res) => {
  const id = req.params.id * 1;
  const job = jobs.find((el) => el._id === id);

  jobs.splice(job._id - 1, 1);

  fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
    return res.status(204).json({
      status: "success",
      requestMadeAt: req.requestTime,
      data: null,
    });
  });
};
