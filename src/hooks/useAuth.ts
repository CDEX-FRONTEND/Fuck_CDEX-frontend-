import { useContext } from 'react';
import { AuthContext } from '../components/AuthProvider/AuthContext';

const useAuth = () => useContext(AuthContext);

export { useAuth };
