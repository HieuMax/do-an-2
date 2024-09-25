const express = require("express");
const apiRouter = express.Router();

const students = require('../services/student');
const mentors = require('../services/mentor');
const projects = require('../services/project')

apiRouter.use('/students', students);
apiRouter.use('/mentors', mentors);
apiRouter.use('/projects', projects);

module.exports = apiRouter