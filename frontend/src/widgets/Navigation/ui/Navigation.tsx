import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import { NAV_LINKS } from '../config';

import styles from './Navigation.module.sass';

const Navigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className={clsx(['container', styles.navigation])}>
      {NAV_LINKS.map(item => {
        const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
        return (
          <NavLink
            onClick={() => {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }}
            key={item.href}
            to={item.href}
            className={clsx([styles.navigation_link], isActive ? styles.activeIcon : '')}
          >
            <img src={item.icon} alt={item.alt} width={24} height={24} />
            <p>{item.title}</p>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
