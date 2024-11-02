import React from 'react';
import { Pagination, Table } from 'antd';
const columns = [
  {
    title: 'Mã đề tài',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
    width: '15%',
  },
  {
    title: 'Tên đề tài',
    width: '60%',
    dataIndex: 'name',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    width: '40%',
  },
  {
    title: '',
    dataIndex: 'detail',
    width: '12%',
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
  console.log(pagination);
};

const onChangePag = (pagination) => {
     
    const table = document.getElementById('table')
    console.log(table)
}
const ReportListCard = ({ props }) => {

    return (
        <div className='min-w-full'>
            <Table id='table' columns={columns} dataSource={props} onChange={onChange} />
            {/* <Pagination align='end' total={50} onChange={onChangePag}/> */}

        </div>
    )
};
export default ReportListCard;