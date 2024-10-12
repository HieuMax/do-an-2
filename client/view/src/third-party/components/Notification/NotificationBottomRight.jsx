import { notification } from 'antd';
const NotificationBottomRight = (message) => {

  return ( notification.success({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    rtl: true,
    message: message,
  }));
};

export default NotificationBottomRight;