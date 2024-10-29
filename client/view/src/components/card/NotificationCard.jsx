import React from 'react'
import { calcSentTime } from '../../utils/CalcSentTime'
import { updateSeenMsg } from '../../controller/7.notify/notify'

export const NotificationCard = ({ item }) => {
  const handleClick = (item) => {
    // Update mark read notify
    updateSeenMsg(item.messagesid)
  }
  return (
    <a href={`/detail-project/${item.detaiid}`} onClick={() => handleClick(item)}>
        <div className="rounded-lg p-3 flex space-y-2 hover:bg-gray-100  cursor-pointer">
            <div className="mr-3">
                <img 
                src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a&bold=true&name=Q+L" 
                alt="" 
                className='w-12 h-12 rounded-lg'/>
            </div>
            <div className="space-y-2 w-full px-3">
                <div className="font-semibold text-xl flex items-center justify-between">{item.title}{item.tag && item.tag}</div>
                <div className="text-gray-600 opacity-80 flex items-center " >
                    {/* {item.time_stamp} */}
                    {calcSentTime(item.time_stamp)}
                    <p className='w-2.5 h-2.5 opacity-80 bg-gray-700 rounded-full mx-3'/> 
                    {item.detaiid}
                </div>
                <div className="bg-gray-100 w-full p-3 rounded-lg">
                    {item._message}
                </div>
            </div>
        </div>
        <hr />
    </a>
  )
}
