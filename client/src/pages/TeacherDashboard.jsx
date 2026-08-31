import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BrainCircuit,
    FileText,
    Users,
    TrendingUp,
    Plus,
    ArrowRight,
    Trash2,
    HelpCircle,
} from 'lucide-react';

import { useUserStore } from '../store/userStore.js';
import { useAdminStore } from '../store/adminStore.js';
import { useQuizStore } from '../store/quizStore.js';
import { formatDate } from '../utils/formatDate.js';

function StatCard({ label, value, icon: Icon, color, gradient }) {
    return (
        <div className={`rounded-xl p-5 bg-gradient-to-br ${gradient} border border-[#F5F5F5]/10`}>
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
}

export default function TeacherDashboard() {
    const { user, userStates } = useUserStore();
    const { teacherAnalytics, studentProgress, isLoading, error, fetchTeacherAnalytics, fetchStudentProgress } = useAdminStore();
    const { userQuizzes, deleteQuiz, deleteQuizId, ftechUserQuizzes } = useQuizStore();

    useEffect(() => {
        fetchTeacherAnalytics();
        fetchStudentProgress();
        ftechUserQuizzes();
    }, [fetchTeacherAnalytics, fetchStudentProgress, ftechUserQuizzes]);

    const totalQuizzes = teacherAnalytics.length;
    const totalAttempts = teacherAnalytics.reduce((sum, q) => sum + (q.attempts || 0), 0);
    const withAttempts = teacherAnalytics.filter((q) => q.attempts > 0);
    const avgScore = withAttempts.length
        ? (withAttempts.reduce((sum, q) => sum + q.averageScore, 0) / withAttempts.length).toFixed(1)
        : 0;

    const stats = [
        { label: 'Quizzes Created', value: totalQuizzes, icon: BrainCircuit, color: '#FF007F', gradient: 'from-[#FF007F]/20 to-[#FF007F]/5' },
        { label: 'Total Attempts', value: totalAttempts, icon: Users, color: '#00E5FF', gradient: 'from-[#00E5FF]/20 to-[#00E5FF]/5' },
        { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: '#4CAF50', gradient: 'from-[#4CAF50]/20 to-[#4CAF50]/5' },
        { label: 'Notes Uploaded', value: userStates?.totalNotes ?? 0, icon: FileText, color: '#FFD93D', gradient: 'from-[#FFD93D]/20 to-[#FFD93D]/5' },
    ];

    const handleDelete = (quiz) => {
        if (!window.confirm(`Delete quiz "${quiz.title}"? This cannot be undone.`)) return;
        deleteQuiz(quiz._id);
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-1">
                        Teacher Dashboard, <span className="capitalize">{user?.name || 'Educator'}</span>
                    </h1>
                    <p className="text-[#F5F5F5]/60">
                        Add quizzes and manage the ones you've created
                    </p>
                </div>
                <Link
                    to="/quizzes/createquiz"
                    className="flex items-center justify-center gap-2 bg-[#FF007F] hover:bg-[#FF007F]/90 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} />
                    <span>Add Quiz</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {/* Manage quizzes */}
            <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden">
                <div className="p-5 border-b border-[#F5F5F5]/10 flex items-center justify-between">
                    <h2 className="font-bold">Manage Quizzes</h2>
                    <span className="text-xs text-[#F5F5F5]/50">{userQuizzes.length} quizzes</span>
                </div>

                {userQuizzes.length === 0 ? (
                    <div className="p-8 text-center">
                        <BrainCircuit size={32} className="mx-auto mb-3 text-[#F5F5F5]/30" />
                        <p className="text-[#F5F5F5]/60 mb-2">You haven't created any quizzes yet.</p>
                        <Link to="/quizzes/createquiz" className="text-[#00E5FF] hover:underline inline-flex items-center gap-1">
                            Add your first quiz <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#F5F5F5]/50 border-b border-[#F5F5F5]/10">
                                    <th className="px-5 py-3 font-medium">Quiz</th>
                                    <th className="px-5 py-3 font-medium">Category</th>
                                    <th className="px-5 py-3 font-medium">Questions</th>
                                    <th className="px-5 py-3 font-medium">Created</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userQuizzes.map((q) => (
                                    <tr key={q._id} className="border-b border-[#F5F5F5]/5 last:border-0">
                                        <td className="px-5 py-3 font-medium">{q.title}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60 capitalize">{q.category || '—'}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">
                                            <span className="inline-flex items-center gap-1">
                                                <HelpCircle size={14} /> {q.questionCount ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{q.createdAt ? formatDate(q.createdAt) : '—'}</td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => handleDelete(q)}
                                                disabled={deleteQuizId === q._id}
                                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                title="Delete quiz"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Student progress */}
            <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden">
                <div className="p-5 border-b border-[#F5F5F5]/10 flex items-center justify-between">
                    <h2 className="font-bold">Student Progress</h2>
                    <span className="text-xs text-[#F5F5F5]/50">{studentProgress.length} students</span>
                </div>

                {studentProgress.length === 0 ? (
                    <div className="p-8 text-center">
                        <Users size={32} className="mx-auto mb-3 text-[#F5F5F5]/30" />
                        <p className="text-[#F5F5F5]/60">No students have joined yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#F5F5F5]/50 border-b border-[#F5F5F5]/10">
                                    <th className="px-5 py-3 font-medium">Student</th>
                                    <th className="px-5 py-3 font-medium">Notes</th>
                                    <th className="px-5 py-3 font-medium">Quizzes Taken</th>
                                    <th className="px-5 py-3 font-medium">Streak</th>
                                    <th className="px-5 py-3 font-medium">Avg Score</th>
                                    <th className="px-5 py-3 font-medium">Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentProgress.map((s) => (
                                    <tr key={s._id} className="border-b border-[#F5F5F5]/5 last:border-0">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#00E5FF] flex items-center justify-center text-[#0D0D0D] font-bold text-sm">
                                                    {(s.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium capitalize">{s.name || '—'}</div>
                                                    <div className="text-xs text-[#F5F5F5]/40">{s.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{s.totalNotes}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{s.totalQuizzesTaken}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{s.streak} day{s.streak === 1 ? '' : 's'}</td>
                                        <td className="px-5 py-3">
                                            <span className={s.averageScore >= 60 ? 'text-[#4CAF50]' : s.averageScore >= 35 ? 'text-[#FFD93D]' : 'text-[#F5F5F5]/60'}>
                                                {s.attempts ? `${s.averageScore}%` : '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{s.lastActive ? formatDate(s.lastActive) : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quiz performance */}
            <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden">
                <div className="p-5 border-b border-[#F5F5F5]/10 flex items-center justify-between">
                    <h2 className="font-bold">Quiz Performance</h2>
                    <span className="text-xs text-[#F5F5F5]/50">{totalQuizzes} quizzes</span>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-[#F5F5F5]/50">Loading analytics...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">{error}</div>
                ) : teacherAnalytics.length === 0 ? (
                    <div className="p-8 text-center text-[#F5F5F5]/60">
                        No quiz analytics yet. Add a quiz and students can start attempting it.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#F5F5F5]/50 border-b border-[#F5F5F5]/10">
                                    <th className="px-5 py-3 font-medium">Quiz</th>
                                    <th className="px-5 py-3 font-medium">Category</th>
                                    <th className="px-5 py-3 font-medium">Questions</th>
                                    <th className="px-5 py-3 font-medium">Attempts</th>
                                    <th className="px-5 py-3 font-medium">Avg Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teacherAnalytics.map((q) => (
                                    <tr key={q._id} className="border-b border-[#F5F5F5]/5 last:border-0">
                                        <td className="px-5 py-3 font-medium">{q.title}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60 capitalize">{q.category}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{q.questionCount}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{q.attempts}</td>
                                        <td className="px-5 py-3">
                                            <span className={q.attempts ? 'text-[#4CAF50]' : 'text-[#F5F5F5]/40'}>
                                                {q.attempts ? `${q.averageScore}%` : '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}