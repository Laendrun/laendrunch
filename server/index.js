const express = require('express');
const cors = require('cors');
const app = express();

const emailRoutes = require('./api/routes/email');
const authRoutes = require('./api/routes/auth');

app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
    res.json({
        message: '🛠 Hello World 🛠'
    });
});

app.use('/email', emailRoutes);
app.use('/auth', authRoutes);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4040; 
app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});