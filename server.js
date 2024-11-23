const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const { Sequelize, Op } = require('sequelize'); // Import thêm Op
const { User, Booking, Room, sequelize } = require('./models');
const { error } = require('console');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Lấy danh sách phòng
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Tạo booking mới
/*app.post('/book', async (req, res) => {
  const { start, end, title, UserId, RoomId } = req.body;
  try {
    const overlappingBooking = await Booking.findOne({
      where: {
        RoomId,
        approved: true,
        [Op.or]: [
          { start: { [Op.lt]: end }, end: { [Op.gt]: start } }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    const booking = await Booking.create({ start, end, title, UserId, RoomId });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});*/

// Đăng ký người dùng
app.post('/register', async (req, res) => {
  //const { username, password, role } = req.body;
  const { username, password } = req.body;
  try {
    //const user = await User.create({ username, password, role });
    const user = await User.create({ username, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get user
app.get('/users', async(req, res) => {
  const { username, event }  = req.query; 
  try {
    const user = await User.findOne({where: { username }});
    
    if(user){
      const booking = await Booking.findByPk(event.id);
      if(booking){
        console.log(booking, user.id);
        
        booking.UserId = user.id;
        booking.save();

        res.status(200).json(user);
      }else{
        res.status(400).json({error: 'booking not found!!'});
      }
    }else{
      res.status(400).json({ error: 'user not found!!'});
      //res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.log("req: ", error);
    res.status(400).json({error: error.message});
  }
  
});

// Đăng nhập người dùng
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Đăng nhập bằng tên PC
app.post('/login-pc', async (req, res) => {
  const pcUsername = os.userInfo().username; // Get logged-in PC username
  try {
    let user = await User.findOne({ where: { username: pcUsername } });
    if (!user) {
      user = await User.create({ username: pcUsername, password: 'defaultPassword', role: 'user' });
      return res.status(201).json(user);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lấy danh sách các booking
app.get('/bookings', async (req, res) => {
  const { RoomId } = req.query;
  try {
    const whereCondition = RoomId ? { RoomId: RoomId } : {}; // Kiểm tra nếu có roomId thì thêm điều kiện lọc
    const bookings = await Booking.findAll({
      where: whereCondition,
      include: {
        model: User,
        attributes: ['username']  // Lấy username của người dùng
      }
    });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Tạo booking mới
app.post('/book', async (req, res) => {
  const { start, end, title, approved, UserId , RoomId} = req.body;
  const currentTime = new Date();
  
   // Kiểm tra thời gian book phải lớn hơn thời gian hiện tại
   if (new Date(start) <= currentTime) {
    return res.status(400).json({ error: 'Booking time must be in the future' });
  }

  // Kiểm tra thời gian book không vượt quá 2 giờ
  const bookingDuration = (new Date(end) - new Date(start)) / (1000 * 60 * 60); // tính bằng giờ
  if (bookingDuration > 2) {
    return res.status(400).json({ error: 'Booking duration cannot exceed 2 hours' });
  }

  try {
    const overlappingBooking = await Booking.findOne({
      where: {
        //approved: true,
        RoomId,
        [Op.or]: [
          { start: { [Op.lt]: end }, end: { [Op.gt]: start } }
        ],
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    const booking = await Booking.create({ start, end, title, approved, UserId , RoomId});
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approve booking
app.put('/approve/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id);
    if (booking) {
      booking.approved = true;
      await booking.save();
      res.status(200).json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật booking
app.put('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, role, start, end, title } = req.body;
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    // Kiểm tra quyền hạn
    if (role !== 'admin' && booking.UserId !== userId) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    // Cập nhật booking
    booking.start = start;
    booking.end = end;
    booking.title = title;
    await booking.save();
    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Xóa booking
app.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.body;  // Nhận userId và role từ request body
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    // Kiểm tra quyền hạn
    if (role !== 'admin' && booking.UserId !== userId) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    await booking.destroy();
    res.status(200).json({ message: 'Booking removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
