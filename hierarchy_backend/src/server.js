const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors({ origin: ['https://hierarchyfrontend.vercel.app'], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));

// Python analytics proxy
app.get('/api/analytics/org-health', async (req, res) => {
  try {
    const url = process.env.PYTHON_SERVICE_URL;
    const response = await fetch(`${url}/org-health`);
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(503).json({
      success: false,
      message: 'Python service unavailable',
      data: {
        span_of_control: 'Healthy',
        avg_team_size: 3.2,
        recommendation: 'Start Python service for advanced org insights',
      },
    });
  }
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hierarchy Management API running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
