import styles from './CountryList.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCity } from '../contexts/CitiesContext';

function CountryList() {
  const { cities, isLoading } = useCity();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message='Click the map to add your first city' />;

  const countries = cities.reduce((arr, curr) => {
    if (!arr.map((el) => el.country).includes(curr.country))
      return [...arr, { country: curr.country, emoji: curr.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
