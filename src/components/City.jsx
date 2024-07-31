import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCity } from '../contexts/CitiesContext';
import Spinner from './Spinner';
import styles from './City.module.css';

import ButonBack from './ButonBack';
import Flag from './Flag';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function City() {
  const x = useParams();
  const { id } = x;
  const { currentCity, getCurCity, isLoading } = useCity();
  const { cityName, emoji, date, notes } = currentCity;
  useEffect(
    function () {
      getCurCity(id);
    },
    [id, getCurCity]
  );

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          {Flag(emoji, cityName)}
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target='_blank'
          rel='noreferrer'
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <ButonBack />
      </div>
    </div>
  );
}

export default City;
