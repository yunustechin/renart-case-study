import express from 'express';
import cors from 'cors';
import productRoutes from './products.js'; 
import errorHandler from '../utils/errorHandler.js'; 
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

export default app;