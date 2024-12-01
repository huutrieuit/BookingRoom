import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ip, setIP] = useState('');

  //const registerUser = async (username, password, role) => {
  const registerUser = async (username, password) => {
    try {
      //const  response = await axios.post(`${API_BASE_URL}/register`, { username, password, role });
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

  

  const checkLoginForIP = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/check-login-with-ip`);
      if(response.status === 203){
        setIP(response.data);
      }else{
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  const loginUserForPC = async (usernameforpc) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login-pc`, {usernameforpc, ip});
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

  const updateProfile = async(id, username) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/profile/${id}`, {username});
      
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  }

  const updateMyColor = async(id, mycolor) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/mycolor/${id}`,{mycolor});
      setUser(response.data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }

  }

  return (
    <UserContext.Provider value={{ user, registerUser, loginUser, logoutUser, loginUserForPC, checkLoginForIP, updateProfile, updateMyColor }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
