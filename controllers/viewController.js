const Job= require('./../models/jobModel');
const AppError=require('./../utils/appErrors');
const jobController= require("./jobController")
const factory= require("./handlerFactory")
const apiFeatures=require("./../utils/apiFeatures")
const catchAsync=require("./../utils/catchAsync")

exports.homePage= (req, res)=>{
    //Sets content security policy to allow access from other domain
      res.status(200).header('Content-Security-Policy',"img-src 'self' data: https:").render("base");
    }

exports.jobs=catchAsync(async(req,res)=>{
  //1.) Get the jobs data from collection
  const results = new apiFeatures(Job.find(),req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
  const jobs= await results.query;
  
  //render the jobs data to the template 
  res.status(200).header('Content-Security-Policy',"img-src 'self' data: https:").render("job_default",{jobs});
 })
  
  