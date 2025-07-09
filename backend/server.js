const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');
require('dotenv').config();
const path = require('path')

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cart');      // Import cart routes
const paymentRoutes = require('./routes/payment'); // Import payment routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "build")));

// Winston logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// REVERTED: Mounting authRoutes at /api to allow /api/login and /api/signup to work
// IMPORTANT: This means the /api/auth route in your Dashboard.js for user profile
// will likely NO LONGER WORK unless authRoutes.js has a specific router.get('/auth', ...)
app.use('/api', authRoutes); // This will now handle /api/login, /api/signup
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);      // Mount cart routes at /api/cart
app.use('/api/payment', paymentRoutes); // Mount payment routes at /api/payment



app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// Fallback for unknown routes
app.use((req, res, next) => {
    logger.warn(`Unknown route accessed: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Global Error Handler: %o', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});




// MongoDB connection and server start
mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,  // No longer needed in Mongoose 6+ 
    // useUnifiedTopology: true, // No longer needed in Mongoose 6+
})
    .then(() => {
        logger.info('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            logger.info(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        logger.error('❌ MongoDB connection error: %o', err);
        process.exit(1);
    });
