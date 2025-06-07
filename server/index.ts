import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import connectDB from './config/database';
import apiRoutes from './routes/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Serve static files from the client build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
} else {
  // Development route
  app.get('/', (req, res) => {
    res.json({ 
      message: 'REST API with MongoDB and Express',
      endpoints: {
        health: '/api/health',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (requires auth)',
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});