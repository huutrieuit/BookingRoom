import React, { useContext, useState } from 'react';
import { Form, Input, Button, Select, Typography, Row, Col, Card, message } from 'antd';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
  const { registerUser } = useContext(UserContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onFinish = async (values) => {
    /* const { username, password, role } = values;
    const result = await registerUser(username, password, role); */
    const { username, password } = values;
    const result = await registerUser(username, password);
    if (result && result.error) {
      setError(result.error);
      message.error(result.error);
    } else {
      message.success('Registration successful!');
      form.resetFields();
      navigate('/login'); // Navigate to login page after successful registration
    }
  };

  return (
    <Row align="middle" justify="center" style={{ minHeight: '100vh' }}>
      <Col xs={20} sm={16} md={12} lg={8}>
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
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
            {/* <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select placeholder="Select your role">
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Register</Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
