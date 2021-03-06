const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// setting up config files
dotenv.config({path:'./config/config.env'});

const apiRouter = require('./routes/api.js');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Database Connection
const connectDB = require('./config/db');

PORT = process.env.PORT || 5000;

const app = express();
app.use(compression());
connectDB();
// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({credentials: true}));

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(err.status || 401).json({msg:err.message, status: false});
    }
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({msg:err.message, status: false});
});

module.exports = app;
