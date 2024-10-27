import React, { useEffect, useState } from 'react'
import { NotificationCard } from '../../components/card/NotificationCard'
import { Checkbox, Tag } from 'antd'
import { getFullNotification, getNotify, sendMessToAdmin } from '../../controller/7.notify/notify'

export const NotificationPage = () => {
  const [ data, setData ] = useState()

  const notification = async() => {
    await getNotify("GV001","Test", "giangvien")
    // await getNotify(data.giangVienChuNhiemID, "Regist new project", "giangvien")
  }
  const noti2 = async () => await getNotify("SV001","Test", "sinhvien");
  const notiAdmin = async () => await sendMessToAdmin("Test");
  useEffect(() => {
    const fetchNoti = async() => {
      const result = await getFullNotification()
      setData(result)
      // console.log()
    }
    fetchNoti()
    // console.log(data)
  }, [])

  return (
    <div className='flex'>
      {/* <button onClick={notiAdmin}>getNotify</button> */}
      {/* <button onClick={noti2} className='p-3 bg-red-300'>getNotify2</button> */}
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
        {data  && !data.error && data.map((item, i) => <div key={i}><NotificationCard item={item}/></div>)}
      </div>
    </div>
  )
}
