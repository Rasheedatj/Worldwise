import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { useCity } from '../contexts/CitiesContext';
import Flag from './Flag';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function CityItem({ city }) {
  const { id, cityName, date, emoji, position } = city;
  const { currentCity, handleDelete } = useCity();

  function handleClick(e) {
    e.preventDefault();
    handleDelete(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          cityName === currentCity.cityName ? styles['cityItem--active'] : ''
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span>{Flag(emoji)}</span>
        <p className={styles.name}>{cityName}</p>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
