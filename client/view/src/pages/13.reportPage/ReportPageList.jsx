import React from 'react';
import { Tabs } from 'antd';
import { ReportList } from './ReportList';
export const ReportPageList = () => {

  const itemsTabs = [
    {
      key: '1',
      label: 'Đề tài chưa được chấm điểm',
      children: <ReportList prop={5}/>,
    },
    {
      key: '2',
      label: 'Đề tài đã hoàn tất chấm điểm',
      children: <ReportList prop={6}/>,
    },
  ];

  return (
    <div className="py-3 px-3 scroll-smooth h-full max-w-full flex p-3 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold underline">Báo cáo & Nghiệm thu đề tài</h1>
      </div>
      <Tabs defaultActiveKey="1" items={itemsTabs} onChange={() => {}} />
      {/* <Descriptions title="Thông tin đề tài báo cáo" className='w-full text-base' bordered items={items} /> */}
    </div>
    );
}
export default ReportPageList;