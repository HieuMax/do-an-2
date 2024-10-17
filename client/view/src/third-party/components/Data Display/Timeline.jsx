import React from 'react';
import { Tag, Timeline } from 'antd';
const TimelineCom = ({ props }) => (
  <Timeline
    items={[
      {
        children: (
          <>
            <p className='text-base'>Tài liệu đề xuất</p>
            <br />
            {
              props.status == 2
                ?  <Tag color="default" className='text-sm cursor-pointer hover:bg-gray-200' onClick={() => props.action_click_timeline()}>Xem nhận xét</Tag>
                : ""
            }
            {/* <span className='cursor-pointer'>Xem nhận xét</span> */}
            <br />
            <br />
            <br />
          </>
        ),
      },
      {
        color: `${props.proposal ? "blue" : "gray"}`,
        children: (
          <>
            <p className='text-base -mt-1'>Tài liệu thuyết minh</p>
            <br />
            <br />
            <br />
            <br />
          </>
        ),
      },
      {
        color: 'gray',
        children: (
          <>
            <p className='text-base -mt-1'>Tài liệu báo cáo</p>
            <br />
            <br />
            <br />
          </>
        ),
      },
    ]}
  />
);
export default TimelineCom;