const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

const getJob = async (req, res) => {
    const {user: {userId}, params: {id: jobId}} = req;
    const job = await Job.findOne({
        _id: jobId, createdBy: userId
    });
    if (!job) {
        throw new NotFoundError(`Job  not found with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
};

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
};

    // if(req.get("Content-Type")!="application/json") { 
    //     res.status(401).send("Invalid header format"); 
    //     return;
    // }
    // try { 
    //     validator.validate(req.body,itemSchema, {"throwError":true});
    // } catch(err) { 
    //     res.status(401).end("Invalid body format: " + err.message); 
    //     return;
    // }

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
};

const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userId}, 
        params: {id: jobId}} = req;
    if (company === "" || position === "") {
        throw new BadRequestError("Company or position cannot be empty");
    }
    const job = await Job.findByIdAndUpdate(
        {_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true}
    );
    if (!job) {
        throw new NotFoundError(`Job  not found with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
};

const deleteJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userId}, 
        params: {id: jobId}} = req;
    if (company === "" || position === "") {
        throw new BadRequestError("Company or position cannot be empty");
    }
    const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId});
    if (!job) {
        throw new NotFoundError(`Job  not found with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};