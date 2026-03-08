import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import connectDB from './db_config/mongo_connect.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Swagger Setup
// Swagger Setup
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
import authRoutes from './src/routes/authRoutes.js';
import leaveRoutes from './src/routes/leaveRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

// Basic Route for root
app.get('/', (req, res) => {
  res.json({ message: 'Leave Management System Backend API is running' });
});

// Error handling middleware should be the last app.use()
// Error handling middleware should be the last app.use()
import { errorHandler } from './src/utils/errorHandler.js';
app.use(errorHandler);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
