const express = require('express');
const mongoose = require('mongoose');
// const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const globalError = require('./controllers/errorController');

const http = require('http');
const { Server } = require('socket.io');

dotenv.config({ path: './config.env' });

const app = express();
app.use(cors());
app.use(express.static('public'));

// SOCKET IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
  allowEIO3: true,
});

io.on('connection', (socket) => {
  socket.on('join room', (data) => {
    socket.join(data.room);
  });

  socket.on('leave', (data) => {
    socket.leave(data.room);
  });

  socket.on('send message', (data) => {
    socket.to(data.room).emit('receive message', { ...data });
  });
});

// SOCKET IO

// Middlewares
app.use(express.json());
// app.use(morgan('dev'));

// mongoose.connect()
const URL = process.env.MONGOURL;
mongoose.connect(URL).then(() => console.log('Connected'));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//Unhandled Routes
app.all('*', (req, res) => {
  res.status(400).json({
    message: `cant find ${req.originalUrl}`,
  });
});

//Global Error
app.use(globalError);

// listening
const port = process.env.PORT;
server.listen(port);
// app.listen(port);
