import { Button, Card, Col, Form, Input, message, Row, Typography, Tabs } from 'antd';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Login = () => {
  const { loginUser, loginUserForPC, checkLoginForIP } = useContext(UserContext);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const initCheckIPLogin = useCallback(async () => {
    const flag = await checkLoginForIP();
    if (flag) {
      navigate('/book-room');
    }
  }, [checkLoginForIP, navigate]);

  useEffect(() => {
    initCheckIPLogin();
  }, [initCheckIPLogin]);

  const onFinish = async (values) => {
    const { username, password } = values;
    const success = await loginUser(username, password);
    console.log("login with user");
    
    if (success) {
      setError('');
      message.success('Login successful');
      navigate('/book-room'); // Navigate to book room page on successful login
    } else {
      setError('Invalid username or password!');
      message.error('Login failed');
    }
  };

  const handlePcLogin = async (values) => {
    try {
      const { usernameforpc } = values;
      const success = await loginUserForPC(usernameforpc);
      if (success) {
        message.success('Login successful');
        navigate('/book-room'); // Navigate to book room page on successful login
      }
    } catch (error) {
      setError('Invalid username or password!');
      message.error('Login failed');
    }
  };

  const LoginForIPComponent = () => (
    <Card>
      <Form form={form} onFinish={handlePcLogin} layout="vertical">
        <Form.Item
          name="usernameforpc"
          label="Account"
          rules={[{ required: true, message: 'Please input your Account!' }]}
        >
          <Input placeholder="Enter your account" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>Login with PC IP</Button>
        </Form.Item>

        <Text type="warning">Warning: Điền đúng account của mình, account này chỉ điền 1 lần, lần sau sẽ dựa vào ip để login nên sẽ ko được update.</Text>

      </Form>

    </Card>
  );

  const Login = () => (
    <Card>
      <Form form={form2} onFinish={onFinish} layout="vertical">
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

        <div style={{ textAlign: 'center' }}>
          <Link to="/register">Don't have an account? Register here</Link>
        </div>
      </Form>
    </Card>
  );


  return (
    <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
      <Col xs={20} sm={16} md={12} lg={8}>
        <Tabs items={
          [AppleOutlined, AndroidOutlined].map((Icon, i) => {
            const id = String(i + 1);

            if (i === 0) {

              return {
                key: id,
                label: `Login with IP`,
                children: <LoginForIPComponent />,
                icon: <Icon />,
              }

            } else {
              return {
                key: id,
                label: `Login with user`,
                children: <Login />,
                icon: <Icon />,
                disabled: true,
              }

            }
          })
        } />


      </Col>
    </Row>
  );
};

export default Login;
