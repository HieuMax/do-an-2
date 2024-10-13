import { notification } from 'antd';

const NotificationBottomRight_err = (message) => {
  return ( notification.error({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    rtl: true,
    message: message,
  }));
}
export default NotificationBottomRight_err;