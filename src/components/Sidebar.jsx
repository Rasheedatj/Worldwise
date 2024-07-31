import Logo from './Logo';
import AppNav from './AppNav';
import styles from './Sidebar.module.css';
import { Outlet, Link } from 'react-router-dom';
import Footer from './Footer';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link to='/'>
        <Logo />
      </Link>
      <AppNav />
      <Outlet />
      <Footer />
    </aside>
  );
}

export default Sidebar;
