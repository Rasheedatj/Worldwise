import styles from './CityList.module.css';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';
import { useCity } from '../contexts/CitiesContext';
function CityList() {
  const { cities, isLoading } = useCity();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message='Click the map to add your first city' />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  );
}

export default CityList;
