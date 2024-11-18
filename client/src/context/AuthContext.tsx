import { createContext } from 'react';
import { AuthContextType } from '../components/types/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);