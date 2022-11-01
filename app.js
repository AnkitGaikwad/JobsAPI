require('dotenv').config();
require('express-async-errors');
const express = require('express');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// connect db
const connectDB = require('./db/connect');
// authorization middleware for job apis
const AuthenticationMiddleware = require('./middleware/authentication');

const app = express();

// middleware
app.use(express.json());

// extra packages

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', AuthenticationMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Successfully connected to db");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
