export const gradingProposalForm = (data) => [
  {
    STT: '1',
    description: 'Tổng quan tình hình nghiên cứu thuộc lĩnh vực đề tài',
    max: 15,
    key: 'TC1',
    data: data? data.data[0]["diemtc1"]: ""
  },
  {
    STT: '2',
    description: 'Tính cấp thiết/ sự cần thiết của đề tài',
    max: 8,
    key: 'TC2',
    data: data? data.data[0]["diemtc2"]: ""

  },
  {
    STT: '3',
    description: 'Mục tiêu đề tài',
    max: 5,
    key: 'TC3',
    data: data? data.data[0]["diemtc3"]: ""

  },
  {
    STT: '4',
    description: 'Cách tiếp cận và phương pháp thực hiện',
    max: 30,
    key: 'TC4',
    data: data? data.data[0]["diemtc4"]: ""

  },
  {
    STT: '5',
    description: 'Nội dung nghiên cứu và tiến độ thực hiện',
    max: 20,
    key: 'TC5',
    data: data? data.data[0]["diemtc5"]: ""

  },
  {
    STT: '6',
    description: 'Sản phẩm đề tài',
    max: 10,
    key: 'TC6',
    data: data? data.data[0]["diemtc6"]: ""

  },
  {
    STT: '7',
    description: 'Hiệu quả, phương thức chuyển giao kết quả nghiên cứu và khả năng ứng dụng',
    max: 5,
    key: 'TC7',
    data: data? data.data[0]["diemtc7"]: ""

  },
  {
    STT: '8',
    description: 'Kinh phí thực hiện',
    max: 7,
    key: 'TC8',
    data: data? data.data[0]["diemtc8"]: ""
  },
  {
    STT: '',
    description: 'Cộng',
    max: 100,
    key: 'TC',
    data: data? data.data[0]["diemtailieu"]: ""
  },
];