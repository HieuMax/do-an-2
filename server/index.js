const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

module.exports = app;
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.urlencoded({ extended: true }))

const apiRouter = require('./routes/router');

app.use('/api', apiRouter);

if (!module.parent) { 
    // Add your code to start the server listening at PORT below:
    app.listen(PORT, () => {
      console.log(`Server listening on PORT: ${PORT}`)
    })
  }