import { notification } from 'antd';
const NotifyInfo = (message) => {

  return ( notification.open({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    rtl: true,
    message: (
        <div className="line-clamp-1 select-none"><p className='my-2'>Thông báo</p> {message}</div>
    ),
  }));
};

export default NotifyInfo;