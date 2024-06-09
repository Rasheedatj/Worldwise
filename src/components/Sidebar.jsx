import Logo from './Logo';
import AppNav from './AppNav';
import styles from './Sidebar.module.css';
import { Outlet } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWised inc.
        </p>
      </footer>
    </aside>
  );
}

export default Sidebar;
