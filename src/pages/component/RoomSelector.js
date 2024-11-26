import React from 'react';
import { Select, Button, Tag, Flex } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { Option } = Select;

const RoomSelector = ({ rooms, selectedRoom, handleRoomSelect, handleRefresh, colorType }) => (
  <div>
    {rooms && (
      <Select
        placeholder="Select a room"
        style={{ width: 200, marginBottom: 16 }}
        onChange={handleRoomSelect}
        value={selectedRoom}
        optionFilterProp="children"
        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
      >
        {rooms.map(room => (
          <Option key={room.id} value={room.id}>
            {room.name}
          </Option>
        ))}
      </Select>
    )}
    <Button type="text" icon={<SyncOutlined style={{ color: '#1890ff' }} />} onClick={handleRefresh} />
    <div style={{ paddingBottom: 15 }}>
      <Flex gap="4px 0" wrap>
        <Tag color={colorType.APPROVE}>Room Approved</Tag>
        <Tag color={colorType.PENDING}>Room Pending</Tag>
        <Tag color={colorType.PICK}>My Room</Tag>
      </Flex>
    </div>
  </div>
);

export default RoomSelector;
