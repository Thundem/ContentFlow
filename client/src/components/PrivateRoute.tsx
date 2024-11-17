import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Поки триває завантаження, можна повернути компонент завантаження або null
        return null; // Або поверніть індикатор завантаження
    }

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
