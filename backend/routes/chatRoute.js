const router = require('express').Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Room = require('../models/Room');
const ObjectId = require('mongodb').ObjectID;


// Create new a message
router.post('/messages/new', async (req, res) => {
  try {
      const newMessage = new Message({
        message: req.body.message,
        author: req.body.author,
        timestamp: req.body.timestamp,
        received: req.body.received,
        room_id: req.body.room_id
      });
    

    Room.updateOne(
        {_id: req.body.room_id},
        {$push: {messages: newMessage}},
        function(err, data) {
          if(err) console.log(err);
          console.log(data);
        }
    );

    res.status(201).json('savedMessage');
  } catch (err) {
    console.log(err);
    res.status(500).json({err});
  }
});

// Create new a room
router.post('/rooms/new', async (req, res) => {

  try {
      const newRoom = new Room({
        members: req.body.members
      });
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    console.log(err);
    res.status(500).json({err});
  }
});

// Get all the rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({err});
  }
});


// Get all the messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({err});
  }
});


//Get room name by id
router.get('/rooms/:roomId', async (req, res) => {
  const {roomId} = req.params;
  try {
    const room = await Room.findById(roomId);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: 'Room has been not found!' });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;