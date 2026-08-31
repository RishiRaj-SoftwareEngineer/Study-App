import { useEffect, useMemo, useState } from 'react';
import { Trash2, Search, BrainCircuit, HelpCircle } from 'lucide-react';

import { useAdminStore } from '../store/adminStore.js';
import { formatDate } from '../utils/formatDate.js';

const DIFF_COLORS = { Easy: '#4CAF50', Medium: '#FFD93D', Hard: '#FF6B6B' };

export default function AdminQuizzes() {
    const { allQuizzes, isLoading, error, fetchAllQuizzes, deleteQuiz, isMutating } = useAdminStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchAllQuizzes();
    }, [fetchAllQuizzes]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return allQuizzes;
        return allQuizzes.filter(
            (qz) =>
                (qz.title || '').toLowerCase().includes(q) ||
                (qz.category || '').toLowerCase().includes(q) ||
                (qz.createdBy?.name || '').toLowerCase().includes(q),
        );
    }, [allQuizzes, search]);

    const handleDelete = (qz) => {
        if (!window.confirm(`Delete quiz "${qz.title}"? All attempts will also be removed.`)) return;
        deleteQuiz(qz._id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-1">Manage Quizzes</h1>
                    <p className="text-[#F5F5F5]/60">Review and remove quizzes across the platform</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F5]/40" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search quizzes..."
                        className="w-full bg-[#1A1A1A] border border-[#F5F5F5]/10 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:border-[#FF007F] transition-colors"
                    />
                </div>
            </div>

            <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-[#F5F5F5]/50">Loading quizzes...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center">
                        <BrainCircuit size={32} className="mx-auto mb-3 text-[#F5F5F5]/30" />
                        <p className="text-[#F5F5F5]/60">No quizzes found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#F5F5F5]/50 border-b border-[#F5F5F5]/10">
                                    <th className="px-5 py-3 font-medium">Quiz</th>
                                    <th className="px-5 py-3 font-medium">Category</th>
                                    <th className="px-5 py-3 font-medium">Difficulty</th>
                                    <th className="px-5 py-3 font-medium">Questions</th>
                                    <th className="px-5 py-3 font-medium">Created By</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((qz) => (
                                    <tr key={qz._id} className="border-b border-[#F5F5F5]/5 last:border-0">
                                        <td className="px-5 py-3 font-medium">{qz.title || '—'}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60 capitalize">{qz.category || '—'}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className="text-xs px-2 py-1 rounded"
                                                style={{
                                                    background: (DIFF_COLORS[qz.difficulty] || '#888') + '20',
                                                    color: DIFF_COLORS[qz.difficulty] || '#888',
                                                }}
                                            >
                                                {qz.difficulty || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">
                                            <span className="inline-flex items-center gap-1">
                                                <HelpCircle size={14} /> {qz.questions?.length ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">
                                            {qz.createdBy?.name || '—'}
                                            {qz.createdBy?.email && <div className="text-xs text-[#F5F5F5]/40">{qz.createdBy.email}</div>}
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{qz.createdAt ? formatDate(qz.createdAt) : '—'}</td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => handleDelete(qz)}
                                                disabled={isMutating}
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
        </div>
    );
}