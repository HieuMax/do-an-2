import { X } from 'lucide-react'
import { Tag } from "antd";
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { NotificationCard } from '../card/NotificationCard';

export const NotificationDialog = ({ open, close }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = [
    {
        tag: <Tag color='blue'>Phê duyệt</Tag>,
        title: "Xét duyệt đề tài",
        time: "2 giờ trước",
        id: "DT2024001",
        description: "Yêu cầu xét duyệt giảng viên hướng dẫn"
    },
    {
        tag: <Tag color='orange'>Chấm điểm</Tag>,
        title: "Chấm điểm",
        time: "1 giờ trước",
        id: "DT2024001",
        description: "Đề tài DT2024001 đã nộp tài liệu thuyết minh, có thể chấm điểm"
    },
    {
        title: "Chấm điểm",
        time: "1 giờ trước",
        id: "DT2024001",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate fuga, tempore magnam vero sequi inventore adipisci, repudiandae quam iusto quae deleniti consequuntur, blanditiis rerum quisquam eius asperiores animi reprehenderit fugiat."
    }
  ]
  data.reverse()


  useEffect(() => {
    close()
  }, [location])

  return (
    <div className={`${open ? "opacity-100 block" : "opacity-0 hidden"} overflow-hidden absolute max-w-md shadow-xl border-x-2 z-100 top-16  transition-all right-3 bg-white `} >
        <div className="p-3 text-lg font-semibold flex items-center justify-between">Thông báo
            <X size={20} onClick={close} className='cursor-pointer'/>
        </div>
        <hr />
        { data.map((item, i) => ( <div key={i}><NotificationCard item={item}/></div> )) }
        <hr />
        <div className="p-3 float-end cursor-pointer text-gray-500" onClick={() => {navigate("/notification")}}>View more...</div>
    </div>
  )
}
