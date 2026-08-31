import { useEffect, useMemo, useState } from 'react';
import { Trash2, Search, Users } from 'lucide-react';

import { useUserStore } from '../store/userStore.js';
import { useAdminStore } from '../store/adminStore.js';

const ROLE_COLORS = {
    admin: '#FF007F',
    teacher: '#00E5FF',
    student: '#4CAF50',
};

export default function AdminUsers() {
    const { user: currentUser } = useUserStore();
    const { users, isLoading, error, fetchUsers, changeUserRole, deleteUser, isMutating } = useAdminStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                (u.name || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q) ||
                (u.role?.role_name || '').toLowerCase().includes(q),
        );
    }, [users, search]);

    const handleRoleChange = (userId, role_name) => {
        if (!window.confirm(`Set this user's role to "${role_name}"?`)) return;
        changeUserRole(userId, role_name);
    };

    const handleDelete = (u) => {
        if (!window.confirm(`Delete user "${u.name || u.email}"? This cannot be undone.`)) return;
        deleteUser(u._id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-1">Manage Users</h1>
                    <p className="text-[#F5F5F5]/60">View all accounts, update roles, or remove users</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F5]/40" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full bg-[#1A1A1A] border border-[#F5F5F5]/10 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:border-[#FF007F] transition-colors"
                    />
                </div>
            </div>

            <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-[#F5F5F5]/50">Loading users...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center">
                        <Users size={32} className="mx-auto mb-3 text-[#F5F5F5]/30" />
                        <p className="text-[#F5F5F5]/60">No users found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#F5F5F5]/50 border-b border-[#F5F5F5]/10">
                                    <th className="px-5 py-3 font-medium">User</th>
                                    <th className="px-5 py-3 font-medium">Email</th>
                                    <th className="px-5 py-3 font-medium">Role</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => {
                                    const roleName = u.role?.role_name || 'student';
                                    const isSelf = currentUser?._id === u._id;
                                    return (
                                        <tr key={u._id} className="border-b border-[#F5F5F5]/5 last:border-0">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-sm"
                                                        style={{ background: ROLE_COLORS[roleName] || '#4CAF50' }}
                                                    >
                                                        {(u.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium capitalize">{u.name || '—'}</span>
                                                    {isSelf && (
                                                        <span className="text-xs text-[#00E5FF]">(you)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-[#F5F5F5]/60">{u.email}</td>
                                            <td className="px-5 py-3">
                                                <select
                                                    value={roleName}
                                                    disabled={isMutating || isSelf}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    className="bg-[#0D0D0D] border border-[#F5F5F5]/10 rounded-lg px-2 py-1 text-sm capitalize focus:outline-none focus:border-[#FF007F] disabled:opacity-50"
                                                >
                                                    <option value="student">student</option>
                                                    <option value="teacher">teacher</option>
                                                    <option value="admin">admin</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-3">
                                                {isSelf ? (
                                                    <span className="text-xs text-[#F5F5F5]/40">—</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(u)}
                                                        disabled={isMutating}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}