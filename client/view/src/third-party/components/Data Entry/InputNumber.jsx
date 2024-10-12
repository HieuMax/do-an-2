import React, { useState } from 'react';
import { Button, InputNumber, Space } from 'antd';
const InputNumber = () => {
  const [value, setValue] = useState('99');
  return (
    <Space>
      <InputNumber min={0} max={10} value={value} onChange={setValue} />
      {/* <Button
        type="primary"
        onClick={() => {
          setValue(99);
        }}
      >
        Reset
      </Button> */}
    </Space>
  );
};
export default InputNumber;