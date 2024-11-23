import React, { createContext, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //const registerUser = async (username, password, role) => {
  const registerUser = async (username, password) => {
    try {
      //const response = await axios.post(`${API_BASE_URL}/register`, { username, password, role });
      const response = await axios.post(`${API_BASE_URL}/register`, { username, password });
      return response.data;
    } catch (error) {
      console.error(error.response.data);
      return error.response.data
    }
  };

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      setUser(response.data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const loginUserForPC = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login-pc`);
      console.log(response.data);

      setUser(response.data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, registerUser, loginUser, logoutUser, loginUserForPC }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
