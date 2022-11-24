import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { API } from '../data/api';
import { User } from '../types/user';

type UserContextType = {
  user: Nullable<User>;
  loading: boolean;
  error: boolean;
};

export const UserContext = React.createContext<UserContextType>({
  user: null,
  loading: true,
  error: false,
});

export const useUser = () => useContext(UserContext);

type UserContextProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.getUserInfo()
      .then((resp) => setUser(resp.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const value = {
    user,
    loading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
