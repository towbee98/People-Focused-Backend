const fs = require("fs");
const jobs = JSON.parse(fs.readFileSync("jobs.json"));

//ROUTE HANDLERS
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

exports.deleteJob = (req, res) => {
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
