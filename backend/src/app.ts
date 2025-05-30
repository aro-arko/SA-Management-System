import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// route handlers
app.use('/api/v1', router);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('😎Welcome to SA Management Backend Server😎');
});

// not found handler
app.use(notFound);
// global error handler
app.use(globalErrorHandler);

export default app;
