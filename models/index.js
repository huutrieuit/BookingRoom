const { Sequelize, DataTypes, Op } = require('sequelize'); // Import Sequelize, DataTypes và Op
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/book_room_db_test');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: {
      args: true,
      msg: 'Username already exists!'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'Username is required'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'Password is required'
      }
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  
});

// Định nghĩa model Room
const Room = sequelize.define('Room', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'Room name is required'
      }
    }
  }
});

const Booking = sequelize.define('Booking', {
  start: { type: DataTypes.DATE, allowNull: false },
  end: { type: DataTypes.DATE, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  approved: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasMany(Booking);
Booking.belongsTo(User);

Room.hasMany(Booking);
Booking.belongsTo(Room);

sequelize.sync();

module.exports = { User, Room, Booking, sequelize, Op };
