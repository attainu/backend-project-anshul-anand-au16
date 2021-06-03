const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
// Load ENV vars
dotenv.config({path: 'config/config.env'});

// Connect to server
connectDB();

// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

// Body Parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT, 
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold)
);

// Handel Unhandled promise rejection
process.on('unhandledRejection', (err, promise)=>{
  console.log(`Error: ${err.message}`.red);
  //close server & exit process
  server.close(()=> process.exit(1));
});