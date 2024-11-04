import React, { useEffect, useState } from 'react'
import { NotificationCard } from '../../components/card/NotificationCard'
import { Checkbox, Pagination, Tag } from 'antd'
import { getFullNotification } from '../../controller/7.notify/notify'

export const NotificationPage = () => {
  const [ data, setData ] = useState()

  // const notification = async() => {
  //   await getNotify("GV001","Test", "giangvien")
  //   // await getNotify(data.giangVienChuNhiemID, "Regist new project", "giangvien")
  // }
  // const noti2 = async () => await getNotify("SV001","Test", "sinhvien");
  // const notiAdmin = async () => await sendMessToAdmin("Test");

  const [ filter, setFilter ] = useState() // filter bằng API 
  //////////////////////
  // GET DATA //////////
  //////////////////////
  const [ current, setCurrent ] = useState(1)
  const [ records, setRecords ] = useState()
  const onChangePag = (current) => {
      setIsLoading(true)
      setCurrent(current)
  }

  useEffect(() => {
    const fetchNoti = async() => {
      const result = await getFullNotification(current)
      setData(result.data)
      setRecords(result.records.count)
    }
    fetchNoti()
  }, [current])
  
  const handleClickFilter = (e) => {
    setFilter(...filter, e)
  }

  useEffect(() => {
    console.log(filter)
  }, [filter])
  return (
    <div className='flex'>
      {/* <button onClick={notiAdmin}>getNotify</button> */}
      {/* <button onClick={noti2} className='p-3 bg-red-300'>getNotify2</button> */}
      <div className="max-w-md w-1/3 h-screen p-3 border-r-2 border-l-2 shadow-lg mr-10 space-y-2 sticky top-0">
        <p className='font-semibold text-lg'>Bộ lọc</p>
        <hr />
        <ul className='space-y-4'>
          <li className='space-x-3 my-3' onClick={() => handleClickFilter({ Tag: "Phê duyệt" })}> 
            <Checkbox>
              <Tag color='blue' className='select-none text-base'>Phê duyệt</Tag>
            </Checkbox> 
          </li>
          <li className='space-x-3'  onClick={() => handleClickFilter({ Tag: "Chấm điểm" })}> 
            <Checkbox>
              <Tag color='orange' className='select-none text-base'>Chấm điểm</Tag>
            </Checkbox> 
          </li>
          <li className='space-x-3'  onClick={() => handleClickFilter({ Tag: "Chưa đọc" })}> 
            <Checkbox>
              <Tag className='select-none text-base'>Chưa đọc</Tag>
            </Checkbox> 
          </li>
        </ul>
      </div>
      <div className="flex-col w-full">
        {data  && !data.error && data.map((item, i) => (
          <div key={i}>
            <NotificationCard item={item}/>
            
          </div>
          ))}
          <div className="my-6"><Pagination align='end' total={records} current={current} onChange={onChangePag}/></div>
      </div>
    </div>
  )
}
