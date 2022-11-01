const getJob = async (req, res) => {
    res.send("Getting all jobs...");
};

const getAllJobs = async (req, res) => {
    res.send("getting single job...");
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYxMGY2NTg2MTNkMzdmZTNhNzA5ZTMiLCJuYW1lIjoiQW5raXRhIiwiaWF0IjoxNjY3MzA1MzE3LCJleHAiOjE2Njk4OTczMTd9.FsualWfZLeQkKB-AvPtr6hdka7_xLnlbPNhtI64oimU
const createJob = async (req, res) => {
    res.json(req.user);
};

const updateJob = async (req, res) => {
    res.send("updating job");
};

const deleteJob = async (req, res) => {
    res.send("deleting job");
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};