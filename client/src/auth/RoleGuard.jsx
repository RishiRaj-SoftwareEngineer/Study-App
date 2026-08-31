import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore.js';
import { getRole } from '../utils/roles.js';

const RoleGuard = ({ allowed = [] }) => {
    const { user, fetchUser, isLoading } = useUserStore();

    useEffect(() => {
        if (!user && !isLoading) fetchUser();
    }, [user, isLoading, fetchUser]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64 text-[#F5F5F5]/50">
                Loading...
            </div>
        );
    }

    if (!allowed.includes(getRole(user))) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;