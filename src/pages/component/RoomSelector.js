import React, { useContext } from 'react';
import { Select, Button, Tag, Flex, ColorPicker, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';

const { Option } = Select;

const RoomSelector = ({ rooms, selectedRoom, handleRoomSelect, handleRefresh, colorType }) => {
  const { user, updateMyColor } = useContext(UserContext);

  const setMyColor = async (color) => {
    const result = await updateMyColor(user.id, color.toHexString());
    if (result && result.error) {
      message.error(result.error);
    } else {
      message.success('Set color successful!');
    }
  }

  return (
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
          <Tag color={colorType.APPROVE} style={{ cursor: 'not-allowed' }}>Room Approved</Tag>
          <Tag color={colorType.PENDING} style={{ cursor: 'not-allowed' }}>Room Pending</Tag>
          <ColorPicker value={user.mycolor} onChange={setMyColor}>
            <Tag color={user.mycolor} style={{ cursor: 'pointer' }}>My Room</Tag>
          </ColorPicker>
        </Flex>
      </div>
    </div>
  )
};

export default RoomSelector;
