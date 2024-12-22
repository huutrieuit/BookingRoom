import { CheckCircleOutlined, CheckOutlined, DeleteOutlined, StopOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Button, Layout, message, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BookingContext } from '../context/BookingContext';
import { UserContext } from '../context/UserContext';
import BookingCalendar from './component/BookingCalendar';
import FooterComponent from './component/FooterComponent';
import HeaderComponent from './component/HeaderComponent';
import RoomSelector from './component/RoomSelector';
import TransferModal from './component/TransferModal';

const { Content } = Layout;
const localizer = momentLocalizer(moment);

const BookRoom = () => {
  const { rooms, bookings, fetchBookings, addBooking, approveBooking, removeBooking, updateBooking, transferUser } = useContext(BookingContext);
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [event, setEvent] = useState([]);

  const colorType = {
    APPROVE: '#108ee9',
    PENDING: '#87d068'
  }

  useEffect(() => {
    console.log("3");
    const transformedBookings = bookings.map(booking => ({
      //title: booking.title.includes('@') ? booking.title : `@${booking.user}: ${booking.title}`,
      title: booking.title,
      start: new Date(booking.start),
      end: new Date(booking.end),
      id: booking.id,
      approved: booking.approved,
      RoomId: booking.RoomId,
      UserId: booking.UserId,
      username: booking.user
    }));

    setEvents(transformedBookings);
  }, [bookings]);

  useEffect(() => {
    if (selectedRoom) {
      fetchBookings(selectedRoom);
      console.log("2");
    }
  }, [selectedRoom]);


  useEffect(() => {
     console.log("1");
     if (rooms.length > 0 && selectedRoom === null) {
       setSelectedRoom(rooms[0].id);
       fetchBookings(rooms[0].id);
     }
     
   }, [rooms, selectedRoom, fetchBookings]);

  const handleSelectSlot = async ({ start, end }) => {
    if (user) {
      const title = window.prompt('New Event name');
      if (title) {
        const newBooking = { start, end, title, approved: user.role === 'admin', UserId: user.id, RoomId: selectedRoom };
        const result = await addBooking(newBooking);
        if (result && result.error) {
          message.error(result.error);
        }
      }
    } else {
      message.error('Please log in to book a room');
    }
  };

  const handleEventResize = ({ event, start, end }) => {
    updateBooking(event.id, selectedRoom, { title: event.title, start, end });
  };

  const handleEventDrop = ({ event, start, end }) => {
    updateBooking(event.id, selectedRoom, { title: event.title, start, end });
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.UserId === user.id ? user.mycolor : (event.approved ? colorType.APPROVE : colorType.PENDING);
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        //display: 'block'
      }
    };
  };

  const handleEventChangeUser = (event) => {
    setEvent(event);
    if (event.UserId === user.id) {
      setIsTransferModalVisible(true);
    }
    fetchBookings(selectedRoom);
  }

  const handleTransfer = async (values) => {
    const { username } = values;
    const result = await transferUser(username, event);
    if (result && result.error) {
      message.error(result.error);
    } else {
      setIsTransferModalVisible(false);
      message.success("Booking transferred successfully");
      fetchBookings(selectedRoom);
    }
  };

  const slotPropGetter = (date) => {
    const hours = date.getHours();
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return {
        style: {
          backgroundColor: '#eeeee4' // Light red for Saturday and Sunday
        }
      };
    } else {
      if (hours >= 8 && hours <= 17) {
        return {
          style: {
            backgroundColor: '#e6f7ff' // Light blue for working hours
          }
        };
      } else {
        return {
          style: {
            backgroundColor: '#eeeee4' // Light red for non-working hours
          }
        };
      }
    }

  };

  const renderEvent = (event) => {
    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
          <div>
            {event.event.approved ? (<CheckCircleOutlined />) : (<StopOutlined />)}
            <span>{" " + event.event.username}</span>
          </div>
          <div>
            <span>
              {user.role === 'admin' && (
                <>
                  <Tooltip title="Approve">
                    <Popconfirm
                      title="Are you sure to approve this booking?"
                      onConfirm={() => approveBooking(event.event.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button style={{ padding: 0, height: '20px', width: '20px' }} type="link" icon={<CheckOutlined style={{ color: 'white' }} />} />
                    </Popconfirm>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Popconfirm
                      title="Are you sure to delete this booking?"
                      onConfirm={() => removeBooking(event.event.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button style={{ padding: 0, height: '20px', width: '20px' }} type="link" icon={<DeleteOutlined style={{ color: 'white' }} />} />
                    </Popconfirm>
                  </Tooltip>
                </>
              )}
              {event.event.UserId === user.id && (
                <>
                  <Tooltip title="switch user">
                    <Popconfirm
                      title="Are you sure to switch user this booking?"
                      onConfirm={() => handleEventChangeUser(event.event)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button style={{ padding: 0, height: '20px', width: '20px' }} type="link" icon={<UserSwitchOutlined style={{ color: 'white' }} />} />
                    </Popconfirm>
                  </Tooltip>
                  {
                    user.role !== 'admin' && (
                      <Tooltip title="Delete">
                        <Popconfirm
                          title="Are you sure to delete this booking?"
                          onConfirm={() => removeBooking(event.event.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button style={{ padding: 0, height: '20px', width: '20px' }} type="link" icon={<DeleteOutlined style={{ color: 'white' }} />} />
                        </Popconfirm>
                      </Tooltip>
                    )
                  }

                </>
              )}
            </span>
          </div>
        </div>
        <div>
          <span>{event.title}</span>
        </div>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent />
      <Content style={{ margin: '16px', padding: '12px', background: '#fff', borderRadius: '8px' }}>
        <RoomSelector
          rooms={rooms}
          selectedRoom={selectedRoom}
          handleRoomSelect={setSelectedRoom}
          handleRefresh={() => fetchBookings(selectedRoom)}
          colorType={colorType}
        />
        <BookingCalendar
          events={events}
          localizer={localizer}
          slotPropGetter={slotPropGetter}
          handleSelectSlot={handleSelectSlot}
          eventStyleGetter={eventStyleGetter}
          handleEventDrop={handleEventDrop}
          handleEventResize={handleEventResize}
          renderEvent={renderEvent}
        />
      </Content>
      <FooterComponent />
      {/* Modal for transferring booking */}
      <TransferModal
        isVisible={isTransferModalVisible}
        onCancel={() => setIsTransferModalVisible(false)}
        handleTransfer={handleTransfer}
      />
    </Layout>
  );
};

export default BookRoom;
