import { createContext, useContext, useEffect, useState } from 'react';

const CitiesContext = createContext();
const BASE_URL = 'http://localhost:8000/cities';
function CityProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  async function getCurCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/${id}`);
      if (!res.ok) throw new Error('Error fetching from this endpoint');
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function () {
    async function getCities() {
      try {
        setIsLoading(true);
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error('Error loading cities');
        const data = await res.json();
        setCities(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getCities();
  }, []);

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Error loading cities');
      const data = await res.json();
      console.log(data);
      setCities((s) => [...s, data]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id) {
    setCities((cities) => cities.filter((city) => city.id !== id));
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'Delete',
      });
      if (!res.ok) throw new Error('Error deleting city');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCurCity,
        currentCity,
        createCity,
        handleDelete,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCity() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error('You used context out of scope');
  return context;
}

export { CityProvider, useCity };
