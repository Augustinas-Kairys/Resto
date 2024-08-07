import { FC, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import notificationSound from '../Assets/notification.mp3';
import '../Assets/styles.scss';

interface NotificationProps {
  message: string;
  type: 'success' | 'danger' | 'info';
  id: number; 
}

const Notification: FC<NotificationProps> = ({ message, type, id }) => {
  useEffect(() => {
    const audio = new Audio(notificationSound);
    audio.play();

    const timeout = setTimeout(() => {
    }, 3000);

    return () => clearTimeout(timeout);
  }, [message, type]); 

  const iconMap = {
    success: faCheckCircle,
    danger: faExclamationCircle,
    info: faInfoCircle,
  };

  return (
    <div
      className={`notification position-fixed top-0 end-0 p-3 m-3 bg-${type} text-white rounded shadow animate__animated animate__slideInLeft`}
      style={{ zIndex: 9999, maxWidth: '300px', marginTop: `${id * 70}px` }}
    >
      <div className="d-flex align-items-center">
        <div className="notification-icon me-2">
          <FontAwesomeIcon icon={iconMap[type]} />
        </div>
        <div className="notification-content">
          <p className="mb-0">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
