import { useEffect, useMemo, useState } from 'react';
import { Trash2, Search, FileText, ExternalLink } from 'lucide-react';

import { useAdminStore } from '../store/adminStore.js';
import { formatDate } from '../utils/formatDate.js';

export default function AdminNotes() {
    const { allNotes, isLoading, error, fetchAllNotes, deleteNote, isMutating } = useAdminStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchAllNotes();
    }, [fetchAllNotes]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return allNotes;
        return allNotes.filter(
            (n) =>
                (n.title || '').toLowerCase().includes(q) ||
                (n.subject || '').toLowerCase().includes(q) ||
                (n.uploadedBy?.name || '').toLowerCase().includes(q),
        );
    }, [allNotes, search]);

    const handleDelete = (n) => {
        if (!window.confirm(`Delete note "${n.title}"? The file will also be removed.`)) return;
        deleteNote(n._id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-1">Manage Notes</h1>
                    <p className="text-[#F5F5F5]/60">Review and remove notes across the platform</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F5]/40" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full bg-[#1A1A1A] border border-[#F5F5F5]/10 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:border-[#FF007F] transition-colors"
                    />
                </div>
            </div>

            <div className="rounded-xl bg-[#1A1A1A] border border-[#F5F5F5]/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-[#F5F5F5]/50">Loading notes...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center">
                        <FileText size={32} className="mx-auto mb-3 text-[#F5F5F5]/30" />
                        <p className="text-[#F5F5F5]/60">No notes found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#F5F5F5]/50 border-b border-[#F5F5F5]/10">
                                    <th className="px-5 py-3 font-medium">Title</th>
                                    <th className="px-5 py-3 font-medium">Subject</th>
                                    <th className="px-5 py-3 font-medium">Uploaded By</th>
                                    <th className="px-5 py-3 font-medium">Type</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((n) => (
                                    <tr key={n._id} className="border-b border-[#F5F5F5]/5 last:border-0">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{n.title || '—'}</span>
                                                {n.fileUrl && (
                                                    <a href={n.fileUrl} target="_blank" rel="noreferrer" className="text-[#00E5FF] hover:underline" title="Open file">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60 capitalize">{n.subject || '—'}</td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">
                                            {n.uploadedBy?.name || '—'}
                                            {n.uploadedBy?.email && <div className="text-xs text-[#F5F5F5]/40">{n.uploadedBy.email}</div>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="uppercase text-xs px-2 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF]">{n.fileType || '—'}</span>
                                        </td>
                                        <td className="px-5 py-3 text-[#F5F5F5]/60">{n.createdAt ? formatDate(n.createdAt) : '—'}</td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => handleDelete(n)}
                                                disabled={isMutating}
                                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                title="Delete note"
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