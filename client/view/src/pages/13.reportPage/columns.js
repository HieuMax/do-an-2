export const columns = [
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