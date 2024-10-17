export const gradingRecomForm = (data) => [
    {
      STT: '1',
      description: 'Tên đề tài',
      max: 10,
      key: 'TC1',
      data: data? data.data[0]["diemtc1"]: ""
    },
    {
      STT: '2',
      description: 'Tính mới',
      max: 10,
      key: 'TC2',
      data: data? data.data[0]["diemtc2"]: ""

    },
    {
      STT: '3',
      description: 'Sự cần thiết',
      max: 10,
      key: 'TC3',
      data: data? data.data[0]["diemtc3"]: ""

    },
    {
      STT: '4',
      description: 'Mục tiêu',
      max: 10,
      key: 'TC4',
      data: data? data.data[0]["diemtc4"]: ""

    },
    {
      STT: '5',
      description: 'Nội dung nghiên cứu',
      max: 10,
      key: 'TC5',
      data: data? data.data[0]["diemtc5"]: ""

    },
    {
      STT: '6',
      description: 'Phương pháp nghiên cứu',
      max: 10,
      key: 'TC6',
      data: data? data.data[0]["diemtc6"]: ""

    },
    {
      STT: '7',
      description: 'Sản phẩm',
      max: 10,
      key: 'TC7',
      data: data? data.data[0]["diemtc7"]: ""

    },
    {
      STT: '8',
      description: 'Kinh phí thực hiện',
      max: 10,
      key: 'TC8',
      data: data? data.data[0]["diemtc8"]: ""
    },
    {
      STT: '',
      description: 'Cộng',
      max: 80,
      key: 'TC',
      data: data? data.data[0]["diemtailieu"]: ""
    },
  ]