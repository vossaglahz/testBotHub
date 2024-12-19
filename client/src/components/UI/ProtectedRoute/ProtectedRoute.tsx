import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ILawyer } from '../../../interfaces/Lawyer.interface';
import { IUser } from '../../../interfaces/User.interface';

type TProps = {
    client: IUser | ILawyer;
    children: ReactNode;
    loading: boolean;
};

export const ProtectedRoute = ({ client, children, loading }: TProps) => {
    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!client.refreshToken) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export const ProtectedRouteAdmin = ({ client, children, loading }: TProps) => {
    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (client.role !== "admin") {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};