import { AxiosError } from 'axios';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { APIV2 } from '../data/api';
import { User } from '../types/user';

type UserContextType = {
  user: User | undefined;
  loading: boolean;
  error: boolean;
};

export const UserContext = React.createContext<UserContextType>({
  user: undefined,
  loading: true,
  error: false,
});

export const useUser = () => useContext(UserContext);

type UserContextProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API = useMemo(() => new APIV2(), []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await API.getUserInfo();
        const user = response.data;
        setUser(user);
      } catch (error) {
        if (!(error instanceof AxiosError)) return setError(true); // TODO: set custom error

        if (error.status === 401) {
          console.log('Not Authorized!');
        }
        setError(true); // need refactor
      }
      setLoading(false);
    })();
  }, [API]);

  const value = {
    user,
    loading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
