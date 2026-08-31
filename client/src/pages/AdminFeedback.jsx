import { useEffect, useMemo, useState } from 'react';
import { Trash2, Search, MessageSquare, X, Star } from 'lucide-react';
import { useFeedbackStore } from '../store/feedbackStore.js';
import { formatDate } from '../utils/formatDate.js';

export default function AdminFeedback() {
    const { feedback, isLoading, error, fetchFeedback, deleteFeedback } = useFeedbackStore();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return feedback;
        return feedback.filter(
            (f) =>
                (f.name || '').toLowerCase().includes(q) ||
                (f.email || '').toLowerCase().includes(q) ||
                (f.feedbackType || '').toLowerCase().includes(q),
        );
    }, [feedback, search]);

    const handleDelete = async (f) => {
        if (!window.confirm(`Delete feedback from "${f.name}"?`)) return;
        try {
            await deleteFeedback(f._id);
            if (selected && selected._id === f._id) setSelected(null);
        } catch (e) {
            alert(e.message);
        }
    };

    const typeLabel = (type) =>
        ({
            general: 'General',
            bug: 'Bug Report',
            feature: 'Feature Request',
            content: 'Content',
            other: 'Other',
        })[type] || type || '—';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-1">Manage Feedback</h1>
                    <p className="text-[#F5F5F5]/60">Click a feedback to view full details</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F5]/40" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search feedback..."
                        className="w-full bg-[#1A1A1A] border border-[#F5F5F5]/10 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:border-[#FF007F] transition-colors"
                    />
                </div>
            </div>

            <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-[#F5F5F5]/50">Loading feedback...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center">
                        <MessageSquare size={32} className="mx-auto mb-3 text-[#F5F5F5]/30" />
                        <p className="text-[#F5F5F5]/60">No feedback found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#F5F5F5]/50 border-b border-[#F5F5F5]/10">
                                    <th className="px-5 py-3 font-medium">User</th>
                                    <th className="px-5 py-3 font-medium">Type</th>
                                    <th className="px-5 py-3 font-medium">Rating</th>
                                    <th className="px-5 py-3 font-medium">Feedback</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((f) => (
                                    <tr
                                        key={f._id}
                                        onClick={() => setSelected(f)}
                                        className="border-b border-[#F5F5F5]/5 last:border-0 align-top cursor-pointer hover:bg-[#F5F5F5]/5 transition-colors"
                                    >
                                        <td className="px-5 py-3">
                                            <div className="font-medium capitalize">{f.name || '—'}</div>
                                            {f.email && <div className="text-xs text-[#F5F5F5]/40">{f.email}</div>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="uppercase text-xs px-2 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF]">
                                                {typeLabel(f.feedbackType)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">
                                            {f.rating ? `${f.rating} / 5` : '—'}
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/80 max-w-xs">
                                            {[f.liked, f.improvements, f.newFeatures, f.additionalComments]
                                                .filter(Boolean)
                                                .join(' | ') || '—'}
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">
                                            {f.createdAt ? formatDate(f.createdAt) : '—'}
                                        </td>
                                        <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleDelete(f)}
                                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                                title="Delete feedback"
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

            {/* Detail Modal */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-[#F5F5F5]/10">
                            <div>
                                <h2 className="text-lg font-bold capitalize">{selected.name || 'Feedback'}</h2>
                                <p className="text-xs text-[#F5F5F5]/50">{selected.email}</p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="p-2 rounded-lg hover:bg-[#F5F5F5]/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <span className="uppercase text-xs px-2 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF]">
                                    {typeLabel(selected.feedbackType)}
                                </span>
                                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#FFD93D]/10 text-[#FFD93D]">
                                    {selected.rating ? `${selected.rating} / 5` : 'No rating'}
                                    <Star size={14} className="fill-current" />
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-[#F5F5F5]/50 mb-1">Experience Level</p>
                                <p className="text-sm capitalize">{selected.experience || '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs text-[#F5F5F5]/50 mb-1">What did you like?</p>
                                <p className="text-sm text-[#F5F5F5]/80">{selected.liked || '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs text-[#F5F5F5]/50 mb-1">Improvements</p>
                                <p className="text-sm text-[#F5F5F5]/80">{selected.improvements || '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs text-[#F5F5F5]/50 mb-1">New Features</p>
                                <p className="text-sm text-[#F5F5F5]/80">{selected.newFeatures || '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs text-[#F5F5F5]/50 mb-1">Additional Comments</p>
                                <p className="text-sm text-[#F5F5F5]/80">{selected.additionalComments || '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs text-[#F5F5F5]/50 mb-1">Would Recommend</p>
                                <p className="text-sm">
                                    {selected.wouldRecommend === true
                                        ? 'Yes'
                                        : selected.wouldRecommend === false
                                            ? 'No'
                                            : '—'}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-[#F5F5F5]/10">
                                <p className="text-xs text-[#F5F5F5]/40">
                                    Submitted {selected.createdAt ? formatDate(selected.createdAt) : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}