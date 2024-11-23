import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CheckOutlined, DeleteOutlined, SyncOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Layout, Popconfirm, Space, Select, Tooltip, Typography, Modal, Form, Input, message, Row, Col } from 'antd';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { BookingContext } from '../context/BookingContext';
import { UserContext } from '../context/UserContext';
import { Footer } from 'antd/es/layout/layout';

const { Header, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const BookRoom = () => {
  const { rooms, bookings, fetchBookings, addBooking, approveBooking, removeBooking, updateBooking, transferUser } = useContext(BookingContext);
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    const transformedBookings = bookings.map(booking => ({
      title: booking.title.includes('@') ? booking.title : `@${booking.user}: ${booking.title}`,
      start: new Date(booking.start),
      end: new Date(booking.end),
      id: booking.id,
      approved: booking.approved,
      RoomId: booking.RoomId,
      UserId: booking.UserId
    }));

    setEvents(transformedBookings);
  }, [bookings]);

  useEffect(() => {
    if (selectedRoom) {
      fetchBookings(selectedRoom);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (rooms.length > 0 && selectedRoom === null) {
      setSelectedRoom(rooms[0].id);
      fetchBookings(rooms[0].id);
    }
  }, [rooms]);

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
    const backgroundColor = event.UserId == user.id ? 'green' : (event.approved ? 'DodgerBlue' : 'gray');
    return {
      style: {
        backgroundColor, //borderRadius: '0px',
        opacity: 0.8,
        /* color: 'white',
        border: '1px',
        display: 'block' */
      }
    };
  };

  const handleRoomSelect = (value) => {
    setSelectedRoom(value);
  };


  const handleEventChangeUser = (event) => {
    setEvent(event);
    if (event.UserId == user.id) {
      setIsTransferModalVisible(true);
    }
  }


  const handleRefresh = () => {
    fetchBookings(selectedRoom);
  };

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

  const dayPropGetter = (date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return {
        style: {
          backgroundColor: '#eeeee4' // Light red for Saturday and Sunday
        }
      };
    }
    return {
      style: {
        // backgroundColor: '#e6f7ff' // Light blue for weekdays
      }
    };
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
      <div style={{ position: 'relative', padding: '4px' }}>
        {user.role === 'admin' && (
          <span style={{ position: 'absolute', top: '-9px', right: '0' }}>
            <Tooltip title="Approve">
              <Popconfirm
                title="Are you sure to approve this booking?"
                onConfirm={() => approveBooking(event.event.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" icon={<CheckOutlined style={{ color: 'white' }} />} />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this booking?"
                onConfirm={() => removeBooking(event.event.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" icon={<DeleteOutlined style={{ color: 'white' }} />} />
              </Popconfirm>
            </Tooltip>
          </span>
        )}
        <span>{event.title}</span>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}> <Row justify="space-between" align="middle"> <Col> <img src="/bookroom.png" alt="Book a Room" style={{ width: '100px', height: 'auto', margin: '5px 0' }} /> </Col> <Col> <Tooltip title="Logout"> <Button type="text" icon={<LogoutOutlined style={{ color: '#ff4d4f' }} />} /> {/* Icon logout màu đỏ */} </Tooltip> </Col> </Row> </Header>
      <Content style={{ margin: '16px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
        {rooms && (
          <Select
            placeholder="Select a room"
            style={{ width: 200, marginBottom: 16 }}
            onChange={handleRoomSelect}
            value={selectedRoom}
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {rooms.map(room => (
              <Option key={room.id} value={room.id} selected={1 == room.id} >{room.name}</Option>
            ))}
          </Select>
        )}
        <Button type="text" icon={<SyncOutlined style={{ color: '#1890ff' }} />} onClick={handleRefresh} /> {/* Icon refresh */}
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          defaultView="week"
          slotPropGetter={slotPropGetter}
          dayPropGetter={dayPropGetter}
          defaultDate={moment().toDate()}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventChangeUser}
          eventPropGetter={eventStyleGetter}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          style={{ height: 700, borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
          resizable
          components={{ event: renderEvent }}
          formats={{ timeGutterFormat: 'HH:mm', eventTimeRangeFormat: () => '' }}
          min={new Date(1970, 1, 1, 7)} // Start displaying from 6 AM 
          max={new Date(1970, 1, 1, 19)} // End displaying at 10 PM
        />
      </Content>
      <Footer style={{ background: '#fff', padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}> © 2024 TrieuPH. All rights reserved. </Footer>

      {/* Modal for transferring booking */}
      <Modal
        title="Transfer Booking"
        open={isTransferModalVisible}
        onCancel={() => setIsTransferModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleTransfer} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input the username!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Transfer</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default BookRoom;
