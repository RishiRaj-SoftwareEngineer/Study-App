import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    FileText,
    BrainCircuit,
    ClipboardList,
    Shield,
    ArrowRight,
    GraduationCap,
    UserCog,
} from 'lucide-react';

import { useUserStore } from '../store/userStore.js';
import { useAdminStore } from '../store/adminStore.js';

function StatCard({ label, value, icon: Icon, color, gradient, to }) {
    const inner = (
        <div className={`rounded-xl p-5 bg-gradient-to-br ${gradient} border border-[#F5F5F5]/10 h-full`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#F5F5F5]/60">{label}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
                </div>
                <div className="w-11 h-11 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                    <Icon size={22} style={{ color }} />
                </div>
            </div>
        </div>
    );
    return to ? (
        <Link to={to} className="block hover:opacity-90 transition-opacity">{inner}</Link>
    ) : inner;
}

export default function AdminDashboard() {
    const { user } = useUserStore();
    const { stats, isLoading, error, fetchStats } = useAdminStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const roleMap = {};
    (stats?.roleBreakdown || []).forEach((r) => {
        roleMap[r._id] = r.count;
    });

    const cards = [
        { label: 'Total Users', value: stats?.users ?? 0, icon: Users, color: '#FF007F', gradient: 'from-[#FF007F]/20 to-[#FF007F]/5', to: '/admin/users' },
        { label: 'Total Notes', value: stats?.notes ?? 0, icon: FileText, color: '#00E5FF', gradient: 'from-[#00E5FF]/20 to-[#00E5FF]/5' },
        { label: 'Total Quizzes', value: stats?.quizzes ?? 0, icon: BrainCircuit, color: '#4CAF50', gradient: 'from-[#4CAF50]/20 to-[#4CAF50]/5' },
        { label: 'Quiz Attempts', value: stats?.attempts ?? 0, icon: ClipboardList, color: '#FFD93D', gradient: 'from-[#FFD93D]/20 to-[#FFD93D]/5' },
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-1">
                        Admin Dashboard, <span className="capitalize">{user?.name || 'Admin'}</span>
                    </h1>
                    <p className="text-[#F5F5F5]/60">Platform overview and management</p>
                </div>
                <Link
                    to="/admin/users"
                    className="flex items-center justify-center gap-2 bg-[#FF007F] hover:bg-[#FF007F]/90 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                >
                    <UserCog size={18} />
                    <span>Manage Users</span>
                </Link>
            </div>

            {isLoading ? (
                <div className="p-8 text-center text-[#F5F5F5]/50">Loading stats...</div>
            ) : error ? (
                <div className="p-8 text-center text-red-400">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((c) => (
                        <StatCard key={c.label} {...c} />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Role breakdown */}
                <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 p-5">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-[#FF007F]" /> Users by Role
                    </h2>
                    <div className="space-y-4">
                        {['admin', 'teacher', 'student'].map((role) => (
                            <div key={role}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-[#F5F5F5]/70">{role}</span>
                                    <span className="font-semibold">{roleMap[role] ?? 0}</span>
                                </div>
                                <div className="h-2 bg-[#0D0D0D] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${stats?.users ? ((roleMap[role] ?? 0) / stats.users) * 100 : 0}%`,
                                            background: role === 'admin' ? '#FF007F' : role === 'teacher' ? '#00E5FF' : '#4CAF50',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick admin actions */}
                <div className="lg:col-span-2 rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 p-5">
                    <h2 className="font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/admin/users"
                            className="rounded-xl border border-[#F5F5F5]/10 p-4 hover:bg-[#F5F5F5]/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#FF007F]/10 flex items-center justify-center">
                                    <Users size={20} className="text-[#FF007F]" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">User Management</p>
                                    <p className="text-xs text-[#F5F5F5]/50">View, change roles & remove users</p>
                                </div>
                                <ArrowRight size={18} className="text-[#F5F5F5]/30 group-hover:text-[#FF007F] transition-colors" />
                            </div>
                        </Link>
                        <Link
                            to="/admin/notes"
                            className="rounded-xl border border-[#F5F5F5]/10 p-4 hover:bg-[#F5F5F5]/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                                    <FileText size={20} className="text-[#00E5FF]" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">Manage Notes</p>
                                    <p className="text-xs text-[#F5F5F5]/50">Review & remove shared notes</p>
                                </div>
                                <ArrowRight size={18} className="text-[#F5F5F5]/30 group-hover:text-[#00E5FF] transition-colors" />
                            </div>
                        </Link>
                        <Link
                            to="/admin/quizzes"
                            className="rounded-xl border border-[#F5F5F5]/10 p-4 hover:bg-[#F5F5F5]/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center">
                                    <BrainCircuit size={20} className="text-[#4CAF50]" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">Manage Quizzes</p>
                                    <p className="text-xs text-[#F5F5F5]/50">Review & remove quizzes</p>
                                </div>
                                <ArrowRight size={18} className="text-[#F5F5F5]/30 group-hover:text-[#4CAF50] transition-colors" />
                            </div>
                        </Link>
                        <div className="rounded-xl border border-[#F5F5F5]/10 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                                    <GraduationCap size={20} className="text-[#00E5FF]" />
                                </div>
                                <div>
                                    <p className="font-semibold">Platform Content</p>
                                    <p className="text-xs text-[#F5F5F5]/50">
                                        {stats?.notes ?? 0} notes & {stats?.quizzes ?? 0} quizzes shared
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}