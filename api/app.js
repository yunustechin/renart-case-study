const express = require('express');
const cors = require('cors');
const productRoutes = require('./products');
const errorHandler = require('../utils/errorHandler');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;