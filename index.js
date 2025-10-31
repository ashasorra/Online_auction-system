require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('./config/database'); // Your database config
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

// Middleware to redirect HTTPS to HTTP if needed
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

// Express middleware
app.use(express.json());
app.use(cors());

// Serve static files (React build)
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/public/uploads', express.static('public/uploads'));

// Routers
const usersRouter = require('./app/controllers/users_controller');
const productsRouter = require('./app/controllers/products_controller');
const categoriesRouter = require('./app/controllers/categories_controller');
const sessionsRouter = require('./app/controllers/sessions_controller');
const biddingRouter = require('./app/controllers/bidding_controller');

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/category', categoriesRouter);
app.use('/sessions', sessionsRouter);
app.use('/bidding', biddingRouter);

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Socket.io setup
const io = socket(server);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join_room', (data) => {
    socket.join(data.id);
    socket.broadcast.to(data.id).emit('new_user', `${data.name} has joined`);
    io.to(socket.id).emit('ADMIN_MSG', 'Admin: Welcome to Bidding');

    console.log(`User ${data.name} joined room ${data.id}`);
  });

  // Optionally handle disconnect
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
