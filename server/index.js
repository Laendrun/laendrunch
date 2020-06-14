const express = require('express');
const cors = require('cors');
const app = express();

const emailRoutes = require('./api/routes/email');
const authRoutes = require('./api/routes/auth');
const userRoutes = require('./api/routes/user');

const middlewares = require('./api/middlewares/auth.js');

app.use(cors());
app.use(express.json());
app.use(middlewares.checkTokenSetUser);

app.get('/home', (req, res, next) => {
  res.json({
    message: '🛠 Hello World 🛠',
    user: req.user,
  });
});

app.use('/email', middlewares.isLoggedIn, emailRoutes);
app.use('/user', middlewares.isLoggedIn, userRoutes);
app.use('/auth', authRoutes);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
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