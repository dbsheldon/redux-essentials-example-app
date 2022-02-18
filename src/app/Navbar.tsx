import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchNotifications,
  selectAllNotifications,
} from '../features/notifications/notificationsSlice';
import { useAppDispatch } from './store';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const fetchNewNotifications = () => dispatch(fetchNotifications());
  const notifications = useSelector(selectAllNotifications);
  const numUnreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  const unreadNotificationsBadge =
    numUnreadNotifications > 0 ? (
      <span className="badge">{numUnreadNotifications}</span>
    ) : null;
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notifications {unreadNotificationsBadge}
            </Link>
          </div>
          <div>
            <button className="button" onClick={fetchNewNotifications}>
              Refresh Notifications
            </button>
          </div>
        </div>
      </section>
    </nav>
  );
};
