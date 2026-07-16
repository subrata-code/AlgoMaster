import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import { API_PREFIX, HTTP_STATUS } from './constants/index.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

app.use(API_PREFIX, limiter);

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the AlgoJourney API',
    docs: `${API_PREFIX}/health`,
  });
});

app.use(API_PREFIX, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
