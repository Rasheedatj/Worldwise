import { createContext, useContext, useEffect, useReducer } from 'react';

const CitiesContext = createContext();
const BASE_URL = 'http://localhost:8000/cities';
const initialStates = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case 'loaded':
      return { ...state, isLoading: false };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Action not recognized');
  }
}
function CityProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialStates);
  const { cities, isLoading, currentCity } = state;

  async function getCurCity(id) {
    if (Number(id) === currentCity.id) return;

    try {
      dispatch({ type: 'loading' });
      const res = await fetch(`${BASE_URL}/${id}`);
      if (!res.ok) throw new Error('Error getting current city');
      const data = await res.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch (error) {
      dispatch({ type: 'rejected', payload: error });
    } finally {
      dispatch({ type: 'loaded' });
    }
  }

  useEffect(function () {
    async function getCities() {
      try {
        dispatch({ type: 'loading' });
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error('Error loading cities');
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (error) {
        dispatch({ type: 'rejected', payload: error });
      } finally {
        dispatch({ type: 'loaded' });
      }
    }

    getCities();
  }, []);

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });

      const res = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Error creating a new city');
      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch (error) {
      dispatch({ type: 'rejected', payload: error });
    } finally {
      dispatch({ type: 'loaded' });
    }
  }

  async function handleDelete(id) {
    dispatch({ type: 'city/deleted', payload: id });
    try {
      dispatch({ type: 'loading' });

      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'Delete',
      });
      if (!res.ok) throw new Error('Error deleting this city');
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: 'loaded' });
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
