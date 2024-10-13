const express = require("express");
const apiRouter = express.Router();

const students = require('../services/student');
const mentors = require('../services/mentor');
const projects = require('../services/project');
const departments = require('../services/department');
const classes = require("../services/classes");
const councils = require('../services/councils')

apiRouter.use('/students', students);
apiRouter.use('/mentors', mentors);
apiRouter.use('/projects', projects);
apiRouter.use('/departments', departments);
apiRouter.use('/classes', classes);
apiRouter.use('/councils', councils);

module.exports = apiRouter