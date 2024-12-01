import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Layout, Card, Avatar, Typography, Form, Input, Button, message } from 'antd';
import HeaderComponent from './component/HeaderComponent';
import FooterComponent from './component/FooterComponent';

const { Content } = Layout;
const { Title } = Typography;

const Profile = () => {
    const { user, updateProfile } = useContext(UserContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            username: user.username,
            ip: user.ip,
            // Add other user fields here
        });
    }, [user, form]);

    const handleUpdateProfile = async (values) => {
        setLoading(true);
        try {
            // Call API to update user profile
            const { username } = values;
            const result = await updateProfile(user.id, username);
            //message.success('Profile updated successfully');
            if (result && result.error) {
                message.error(result.error);
            } else {
                message.success('Profile updated successful!');
            }
        } catch (error) {
            message.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HeaderComponent />
            <Content style={{ padding: '50px' }}>
                <Card
                    style={{ maxWidth: '600px', margin: '0 auto' }}
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar size={64} style={{ marginRight: '20px' }} src='/avatar/adventurer-1732969157267.png' />
                            <div>
                                <Title level={2}>Profile</Title>
                            </div>
                        </div>
                    }
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="ip"
                            label="IP"
                        >
                            <Input disabled />
                        </Form.Item>
                        {/* Add other user fields here */}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>Update Profile</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
            <FooterComponent />
        </Layout>
    );
};

export default Profile;
