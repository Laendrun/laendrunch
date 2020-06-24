require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const morgan_type = process.env.NODE_ENV = 'dev' ? 'dev' : 'tiny';

const emailRoutes = require('./api/routes/email');
const authRoutes = require('./api/routes/auth');
const userRoutes = require('./api/routes/user');
const rolesRoutes = require('./api/routes/roles');

const { checkTokenSetUser, isLoggedIn, isSpecial } = require('./api/middlewares/auth.js');

app.use(morgan(morgan_type));
app.use(cors());
app.use(express.json());
app.use(checkTokenSetUser);

app.get('/home', (req, res, next) => {
  res.json({
    message: '🛠 Hello World 🛠',
    user: req.user,
  });
});

app.use('/email', isLoggedIn, emailRoutes);
app.use('/special', isSpecial, emailRoutes);
app.use('/user', isLoggedIn, userRoutes);
app.use('/auth', authRoutes);
app.use('/roles', rolesRoutes);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  console.log(err.message);
  res.status(res.statusCode || 500);
  res.json({
    message: err.message
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4040;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});