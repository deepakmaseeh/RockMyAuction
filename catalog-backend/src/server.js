import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import auctionRoutes from './routes/auctionRoutes.js';
import lotRoutes from './routes/lotRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (_, res) => {
  res.json({
    service: 'rockmyauction-catalog-backend',
    status: 'ok',
  });
});

app.use('/api/catalog/auctions', auctionRoutes);
app.use('/api/catalog/lots', lotRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Catalog service running on port ${PORT}`);
  });
};

startServer();

