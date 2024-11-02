export const gradingReportForm = (data) => [
    {
      STT: '1',
      description: 'Tổng quan tình hình nghiên cứu, lý do chọn đề tài',
      max: 10,
      key: 'TC1',
      data: data? data.data[0]["diemtc1"]: ""
    },
    {
      STT: '2',
      description: 'Mục tiêu đề tài',
      max: 15,
      key: 'TC2',
      data: data? data.data[0]["diemtc2"]: ""
  
    },
    {
      STT: '3',
      description: 'Phương pháp nghiên cứu',
      max: 15,
      key: 'TC3',
      data: data? data.data[0]["diemtc3"]: ""
  
    },
    {
      STT: '4',
      description: 'Nội dung khoa học',
      max: 15,
      key: 'TC4',
      data: data? data.data[0]["diemtc4"]: ""
  
    },
    {
      STT: '5',
      description: 'Đóng góp về mặt kinh tế - xã hội, giáo dục và đào tạo, an ninh, quốc phòng',
      max: 15,
      key: 'TC5',
      data: data? data.data[0]["diemtc5"]: ""
  
    },
    {
      STT: '6',
      description: 'Hình thức trình bày báo cáo tổng kết đề tài',
      max: 5,
      key: 'TC6',
      data: data? data.data[0]["diemtc6"]: ""
  
    },
    {
      STT: '7',
      description: 'Mức độ hoàn thành của các sản phẩm so với TMĐC',
      max: 15,
      key: 'TC7',
      data: data? data.data[0]["diemtc7"]: ""
  
    },
    {
      STT: '8',
      description: 'Điểm thưởng (có công bố khoa học từ kết quả nghiên cứu của đề tài trên các tạp chí chuyên ngành trong và ngoài nước ngoài yêu cầu của đề cương)',
      max: 5,
      key: 'TC8',
      data: data? data.data[0]["diemtc8"]: ""
    },
    {
      STT: '9',
      description: 'Tiến độ thực hiện',
      max: 5,
      key: 'TC9',
      data: data? data.data[0]["diemtc9"]: ""
    },
    {
      STT: '',
      description: 'Cộng',
      max: 100,
      key: 'TC',
      data: data? data.data[0]["diemtailieu"]: ""
    },
  ];