import { createContext, useContext, useReducer, useEffect } from 'react';
import initialData from '../data/initialData';

const AppContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem('appData')) || initialData
  );

  useEffect(() => {
    localStorage.setItem('appData', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
