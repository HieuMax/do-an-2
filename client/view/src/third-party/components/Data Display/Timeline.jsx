import React from 'react';
import { Tag, Timeline } from 'antd';
const TimelineCom = ({ props }) => {
  // console.log(props);
  return(
    <Timeline
      items={[
        {
          children: (
            <>
              <p className='text-base'>Tài liệu đề xuất</p>
              <br />
              {
                props.status >= 2
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
              {
                props.status >= 3
                  ?  <Tag color="default" className='text-sm cursor-pointer hover:bg-gray-200' onClick={() => props.action_click_timeline()}>Xem điểm thuyết minh</Tag>
                  : ""
              }
              <br />
              <br />
              <br />
            </>
          ),
        },
        {
          color: `${props.report ? "blue" : "gray"}`,
          children: (
            <>
              <p className='text-base -mt-1'>Tài liệu báo cáo</p>
              <br />
              {
                props.status >= 5
                  ?  <Tag color="default" className='text-sm cursor-pointer hover:bg-gray-200' onClick={() => props.action_click_timeline()}>Xem điểm báo cáo</Tag>
                  : ""
              }
              <br />
              <br />
            </>
          ),
        },
      ]}
    />
  )
};
export default TimelineCom;