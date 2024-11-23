
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { UserContext } from './UserContext';

const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };


  const fetchBookings = async (RoomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`, { params: { RoomId } });

      const bookings = response.data.map(booking => ({
        ...booking,
        start: new Date(booking.start),
        end: new Date(booking.end),
        user: booking.User ? booking.User.username : 'Unknown'  // Kiểm tra và gán giá trị cho user
      }));

      setBookings(bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  useEffect(() => { if (user) { fetchRooms(); } }, [user]);

  const addBooking = async (booking) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/book`, booking);
      fetchBookings(booking.RoomId);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const approveBooking = async (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, approved: true } : b));
    try {
      await axios.put(`${API_BASE_URL}/approve/${id}`);
    } catch (error) {
      console.error('Failed to approved booking:', error);
    }
  };

  const removeBooking = async (id) => {
    console.log("sss");
    
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${id}`, {
        data: { userId: user.id, role: user.role }  // Gửi userId và role cùng với request
      });
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Failed to remove booking:', error);
      alert(error.response.data.error);
    }
  };

  const updateBooking = async (id, roomId, updatedBooking) => {
    try {
      await axios.put(`${API_BASE_URL}/bookings/${id}`, {
        ...updatedBooking,
        userId: user.id,
        role: user.role
      });
      fetchBookings(roomId);  // Refresh bookings sau khi cập nhật
    } catch (error) {
      alert(error.response.data.error);
      console.error('Failed to update booking:', error);
    } 
  };

  const transferUser = async (username, event) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`,{params: {username, event}});
      const user = response.data;
      return user;
    } catch (error) {
      return error.response.data;
    }
  }

  return (
    <BookingContext.Provider value={{ rooms, bookings, fetchBookings, addBooking, approveBooking, removeBooking, updateBooking, transferUser }}>
      {children}
    </BookingContext.Provider>
  );
};

export { BookingContext, BookingProvider };

