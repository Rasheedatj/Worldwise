import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const initialStates = {
  user: null,
  isUserAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isUserAuthenticated: true };
    case 'logout':
      return { ...state, user: null, isUserAuthenticated: false };
    default:
      throw new Error('Action not recognized');
  }
}

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialStates);
  const { user, isUserAuthenticated } = state;

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: 'login', payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isUserAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('Context is used out of scope');
  return context;
}

export { AuthProvider, useAuth };
