import React from 'react';
import { Button, Col, Row, Tooltip } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const HeaderComponent = ({ handleLogout }) => (
  <header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <Row justify="space-between" align="middle">
      <Col>
        <img src="/bookroom.png" alt="Book a Room" style={{ width: '100px', height: 'auto', margin: '5px 0' }} />
      </Col>
      <Col>
        <Tooltip title="Logout">
          <Button type="text" icon={<LogoutOutlined style={{ color: '#ff4d4f' }} />} onClick={handleLogout} />
        </Tooltip>
      </Col>
    </Row>
  </header>
);

export default HeaderComponent;
