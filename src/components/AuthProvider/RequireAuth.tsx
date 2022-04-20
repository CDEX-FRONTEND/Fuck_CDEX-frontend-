import { FC } from 'react';
import { Redirect } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

interface IRequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: FC<IRequireAuthProps> = ({ children }): JSX.Element => {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return children;
};

export { RequireAuth };
