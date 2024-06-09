// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import { useUrlPosition } from '../hooks/useUrlPosition';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';
import Button from './Button';
import ButonBack from './ButonBack';
import Message from './Message';
import Spinner from './Spinner';
import Flag from './Flag';
import { useCity } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [isLoadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCity();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function getCityData() {
        try {
          setLoadingData(true);
          setDataError('');
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          if (!res.ok) throw new Error('Error fetching data');
          const data = await res.json();
          console.log(data);
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else 😉"
            );
          setCityName(data.city || data.locality || '');
          setCountry(data.countryName);
          setEmoji(data.countryCode);
        } catch (error) {
          setDataError(error.message);
        } finally {
          setLoadingData(false);
        }
      }

      getCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date || !notes) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: +lat,
        lng: +lng,
      },
    };

    await createCity(newCity);
    // go back to city page after adding new city
    navigate('/app/cities');
  }

  if (!lat && !lng) return <Message message='Select a location on the map' />;
  if (isLoadingData) return <Spinner />;
  if (dataError) return <Message message={dataError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {Flag(emoji, cityName, 'absolute')}
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <DatePicker
          id='date'
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <ButonBack />
      </div>
    </form>
  );
}

export default Form;
