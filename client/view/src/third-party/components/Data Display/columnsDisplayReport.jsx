import { Tooltip } from "antd";
import { InfoIcon } from "lucide-react";

export const columnsReport = [
    {
      title: 'Họ tên',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'total',
      key: 'total',
    },
    {
      STT: '1',
      // width: 150,
      title: (
        <Tooltip title="Tổng quan tình hình nghiên cứu, lý do chọn đề tài">
          <span className="flex">Tổng quan <InfoIcon size={15}/> </span>
        </Tooltip>),
      key: 'TC1',
      dataIndex: "diemtc1"
    },
    {
      STT: '2',
      title: 'Mục tiêu đề tài',
      key: 'TC2',
      dataIndex: "diemtc2"
  
    },
    {
      STT: '3',
      title: 'Phương pháp nghiên cứu',
      key: 'TC3',
      dataIndex: "diemtc3"
  
    },
    {
      STT: '4',
      title: 'Nội dung khoa học',
      key: 'TC4',
      dataIndex: "diemtc4"
  
    },
    {
      STT: '5',
      // title: 'Đóng góp về mặt KT-XH, GD - DT, an ninh, quốc phòng',
      title: (
        <Tooltip title="Đóng góp về mặt KT-XH, GD - DT, an ninh, quốc phòng">
          <span className="flex">Các đóng góp <InfoIcon size={15}/> </span>
        </Tooltip>),
      key: 'TC5',
      dataIndex: "diemtc5"
  
    },
    {
      STT: '6',
      title: (
        <Tooltip title="Hình thức trình bày báo cáo tổng kết đề tài">
          <span className="flex">Hình thức trình bày <InfoIcon size={15}/></span>
        </Tooltip>),
      key: 'TC6',
      dataIndex: "diemtc6"
  
    },
    {
      STT: '7',
      title: (
        <Tooltip title="Mức độ hoàn thành của các sản phẩm so với TMĐC">
          <span className="flex">Mức độ hoàn thành <InfoIcon size={15}/></span>
        </Tooltip>),
      key: 'TC7',
      dataIndex: "diemtc7"
  
    },
    {
      STT: '8',
      title: (
      <Tooltip title="Điểm thưởng (có công bố khoa học từ kết quả nghiên cứu của đề tài trên các tạp chí chuyên ngành trong và ngoài nước ngoài yêu cầu của đề cương)">
        <span className="flex">Điểm thưởng <InfoIcon size={15}/></span>
      </Tooltip>),
      key: 'TC8',
      dataIndex: "diemtc8"
    },
    {
      STT: '9',
      title: 'Tiến độ thực hiện',
      key: 'TC9',
      dataIndex: "diemtc9"
    },
    {
      STT: '10',
      title: 'Nhận xét',
      width: 250,
      key: 'comment',
      dataIndex: "comment"
    },
  ];