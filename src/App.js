import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import { BookingProvider } from './context/BookingContext';
import Login from './pages/Login';
import Register from './pages/Register';
import BookRoom from './pages/BookRoom';
import Profile from './pages/Profile';

const App = () => (
  <UserProvider>
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book-room" element={<ProtectedRoute component={BookRoom} />} />
          <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </Router>
    </BookingProvider>
  </UserProvider>
);

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useContext(UserContext);

  return user ? <Component /> : <Navigate to="/login" />;
};

export default App;
