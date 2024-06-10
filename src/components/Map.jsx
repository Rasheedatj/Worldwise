import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import { useCity } from '../contexts/CitiesContext';
import flagemojiToPNG from './Flag';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const { cities } = useCity();
  const {
    isLoading: isLoadingPostion,
    position: geoPosition,
    getPosition,
  } = useGeolocation();
  const [lat, lng] = useUrlPosition();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geoPosition !== null) setMapPosition(geoPosition);
    },
    [geoPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPostion ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{flagemojiToPNG(city.emoji)}</span>
              {city.cityName}
            </Popup>
          </Marker>
        ))}

        <MoveMap position={mapPosition} />
        <MapClick />
      </MapContainer>
    </div>
  );
}

function MoveMap({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

function MapClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
