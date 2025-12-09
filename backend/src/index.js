// // backend/src/index.js

// const express = require('express');
// const salesModel = require('./models/sales.model'); // Import the model setup function
// require('dotenv').config();
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware setup (e.g., body parsing, CORS later)
// app.use(express.json());

// // Basic health check route
// app.get('/', (req, res) => {
//     res.send('TruEstate Backend Running');
// });

// // --- Initialization Function ---
// async function startServer() {
//     // 1. Database Setup (Creates tables, indexes, and triggers)
//     await salesModel.setupDatabase();
    
//     // 2. Start Express Server
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
// }

// // Start the whole application
// startServer();












// backend/src/index.js

const express = require('express');
const { setupDatabase } = require('./models/sales.model');
const salesRoutes = require('./routes/sales.routes');
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Run DB setup on startup
(async () => {
  try {
    await setupDatabase();
  } catch (err) {
    console.error('❌ Failed during DB setup, shutting down server.');
    process.exit(1);
  }
})();

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Main sales API
app.use('/api/sales', salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
