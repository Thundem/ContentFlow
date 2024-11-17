import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminPrivateRouteProps {
    element: JSX.Element;
}

const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({ element }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default AdminPrivateRoute;