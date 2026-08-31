import { create } from 'zustand';
import API from '../config/axios';
import { toast } from 'react-toastify';

export const useAdminStore = create((set, get) => ({
    stats: null,
    users: [],
    teacherAnalytics: [],
    allNotes: [],
    allQuizzes: [],
    studentProgress: [],
    isLoading: false,
    error: null,
    isMutating: false,

    // ---- Admin: platform stats ----
    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.get('/users/admin/stats');
            set({ stats: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to load stats', isLoading: false });
        }
    },

    // ---- Admin: all users ----
    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.get('/users/admin/users');
            set({ users: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to load users', isLoading: false });
        }
    },

    // ---- Admin: change a user's role ----
    changeUserRole: async (userId, role_name) => {
        set({ isMutating: true });
        try {
            const response = await API.patch(`/users/admin/users/${userId}/role`, { role_name });
            set((state) => ({
                users: state.users.map((u) => (u._id === userId ? response.data : u)),
                isMutating: false,
            }));
            toast.success(`Role updated to ${role_name}`);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
            set({ isMutating: false });
            return false;
        }
    },

    // ---- Admin: delete a user ----
    deleteUser: async (userId) => {
        set({ isMutating: true });
        try {
            await API.delete(`/users/admin/users/${userId}`);
            set((state) => ({
                users: state.users.filter((u) => u._id !== userId),
                isMutating: false,
            }));
            toast.success('User deleted successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
            set({ isMutating: false });
            return false;
        }
    },

    // ---- Teacher: analytics for quizzes created by this user ----
    fetchTeacherAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.get('/quiz/teacher/analytics');
            set({ teacherAnalytics: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to load analytics', isLoading: false });
        }
    },
    // ---- Admin: all notes ----
    fetchAllNotes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.get('/notes/admin/all');
            set({ allNotes: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to load notes', isLoading: false });
        }
    },

    // ---- Admin: delete any note ----
    deleteNote: async (noteId) => {
        set({ isMutating: true });
        try {
            await API.delete(`/notes/admin/${noteId}`);
            set((state) => ({ allNotes: state.allNotes.filter((n) => n._id !== noteId), isMutating: false }));
            toast.success('Note deleted successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete note');
            set({ isMutating: false });
            return false;
        }
    },

    // ---- Admin: all quizzes ----
    fetchAllQuizzes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.get('/quiz/admin/all');
            set({ allQuizzes: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to load quizzes', isLoading: false });
        }
    },

    // ---- Admin: delete any quiz ----
    deleteQuiz: async (quizId) => {
        set({ isMutating: true });
        try {
            await API.delete(`/quiz/admin/${quizId}`);
            set((state) => ({ allQuizzes: state.allQuizzes.filter((q) => q._id !== quizId), isMutating: false }));
            toast.success('Quiz deleted successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete quiz');
            set({ isMutating: false });
            return false;
        }
    },
    // ---- Teacher/Admin: student progress ----
    fetchStudentProgress: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.get('/users/staff/students');
            set({ studentProgress: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to load student progress', isLoading: false });
        }
    },
}));