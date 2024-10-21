import React, { useEffect, useState } from 'react'
import { NotificationCard } from '../../components/card/NotificationCard'
import { Checkbox, Tag } from 'antd'
import { getNotificate, getNotify } from '../../controller/7.notify/notify'

export const NotificationPage = () => {
  const [ data, setData ] = useState()
  // const data = [
  //   {
  //       tag: <Tag color='blue'>Phê duyệt</Tag>,
  //       title: "Xét duyệt đề tài",
  //       time: "2 giờ trước",
  //       id: "DT2024001",
  //       description: "Yêu cầu xét duyệt giảng viên hướng dẫn"
  //   },
  //   {
  //       tag: <Tag color='orange'>Chấm điểm</Tag>,
  //       title: "Chấm điểm",
  //       time: "1 giờ trước",
  //       id: "DT2024001",
  //       description: "Đề tài DT2024001 đã nộp tài liệu thuyết minh, có thể chấm điểm"
  //   },
  //   {
  //       title: "Chấm điểm",
  //       time: "1 giờ trước",
  //       id: "DT2024001",
  //       description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate fuga, tempore magnam vero sequi inventore adipisci, repudiandae quam iusto quae deleniti consequuntur, blanditiis rerum quisquam eius asperiores animi reprehenderit fugiat."
  //   }
  // ]
  // data.reverse()

  const [ test, setTest ] = useState('');
  const notification = async() => await getNotify("Test")

  useEffect(() => {
    const fetchNoti = async() => {
      const result = await getNotificate()
      setData(result)
    }
    fetchNoti()
    // console.log(data)
  }, [])

  return (
    <div className='flex'>
      <button onClick={notification}>getNotify</button>
      <div className="max-w-md w-1/3 h-screen p-3 border-r-2 border-l-2 shadow-lg mr-10 space-y-2 ">
        <p className='font-semibold text-lg'>Bộ lọc</p>
        <hr />
        <ul className='space-y-4'>
          <li className='space-x-3 my-3'> 
            <Checkbox>
              <Tag color='blue' className='select-none text-base'>Phê duyệt</Tag>
            </Checkbox> 
          </li>
          <li className='space-x-3'> 
            <Checkbox>
              <Tag color='orange' className='select-none text-base'>Chấm điểm</Tag>
            </Checkbox> 
          </li>
          <li className='space-x-3'> 
            <Checkbox>
              <Tag className='select-none text-base'>Chưa đọc</Tag>
            </Checkbox> 
          </li>
        </ul>
      </div>
      <div className="flex-col w-full">
        {data && data.map((item, i) => <div key={i}><NotificationCard item={item}/></div>)}
      </div>
    </div>
  )
}
