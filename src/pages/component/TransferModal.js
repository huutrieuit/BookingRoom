import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const TransferModal = ({ isVisible, onCancel, handleTransfer }) => (
  <Modal
    title="Transfer Booking"
    open={isVisible}
    onCancel={onCancel}
    footer={null}
  >
    <Form onFinish={handleTransfer} layout="vertical">
      <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input the username!' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Transfer
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default TransferModal;
