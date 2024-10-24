import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { NotificationCard } from '../card/NotificationCard';

export const NotificationDialog = ({ open, close, data }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    close()
  }, [location])

  return (
    <div className={`${open ? "opacity-100 block" : "opacity-0 hidden"} overflow-hidden absolute max-w-md w-full shadow-xl border-x-2 z-100 top-16  transition-all right-3 bg-white `} >
        <div className="p-3 text-lg font-semibold flex items-center justify-between">Thông báo
            <X size={20} onClick={close} className='cursor-pointer'/>
        </div>
        <hr />
        <div className={`max-h-96 overflow-auto`}>
          { data && !data.error && data.map((item, i) => ( <div key={i}><NotificationCard item={item}/></div> )) }
        </div>
        <hr />
        <div className="p-3 float-end cursor-pointer text-gray-500" onClick={() => {navigate("/notification")}}>View more...</div>
    </div>
  )
}
