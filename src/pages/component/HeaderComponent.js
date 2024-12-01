import { UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, Tooltip } from 'antd';
import Link from 'antd/es/typography/Link';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const HeaderComponent = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavProfile = () => {
    navigate('/profile');
  };
  
  const handleNavBookRoom = () => {
    navigate('/book-room');
  };
  return (
    <header style={{ background: '#fff', boxShadow: '0 5px 8px rgba(0,0,0,0.1)' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Link onClick={handleNavBookRoom} >
            <img src="/bookroom.png" alt="Book a Room" style={{ width: '100px', height: 'auto', margin: '5px' }} />
          </Link>
        </Col>
        <Col style={{ marginRight: '15px' }} >
          <Tooltip title="profile" >
            {/* <Button type="text" icon={<LogoutOutlined style={{ color: '#ff4d4f' }} />} onClick={handleNavProfile} /> */}
            <Link onClick={handleNavProfile} >
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            </Link>
          </Tooltip>
          {/* <Tooltip title="Logout">
          <Button type="text" icon={<LogoutOutlined style={{ color: '#ff4d4f' }} />} onClick={logoutUser} />
        </Tooltip> */}
        </Col>
      </Row>
    </header>
  )
};

export default HeaderComponent;
