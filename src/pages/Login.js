import { Button, Card, Col, Form, Input, message, Row, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const { Title } = Typography;

const Login = () => {
  const { loginUser,loginUserForPC } = useContext(UserContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onFinish = async (values) => {
    const { username, password } = values;
    const success = await loginUser(username, password);
    if (success) {
      setError('');
      message.success('Login successful');
      navigate('/book-room'); // Navigate to book room page on successful login
    } else {
      setError('Invalid username or password!');
      message.error('Login failed');
    }
  };

  const handlePcLogin = async () => {
    try {
      const success = await loginUserForPC();
      if(success){
        message.success('Login successful');
        navigate('/book-room'); // Navigate to book room page on successful login
      }
    } catch (error) {
      setError('Invalid username or password!');
      message.error('Login failed');
    }
  };

  return (
    <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
      <Col xs={20} sm={16} md={12} lg={8}>
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
          <Form form={form} onFinish={onFinish} layout="vertical">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Login</Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" block onClick={handlePcLogin}>Login with PC User</Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Link to="/register">Don't have an account? Register here</Link>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
