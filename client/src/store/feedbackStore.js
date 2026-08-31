import { create } from 'zustand';
import API from '../config/axios';

export const useFeedbackStore = create((set, get) => ({
    feedback: [],
    isLoading: false,
    error: null,
    isSubmitting: false,

    submitFeedback: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
            const response = await API.post('/feedback', data);
            set({ isSubmitting: false });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit feedback';
            set({ error: message, isSubmitting: false });
            throw new Error(message);
        }
    },

    fetchFeedback: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.get('/feedback');
            set({ feedback: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to load feedback', isLoading: false });
        }
    },

    deleteFeedback: async (id) => {
        try {
            await API.delete(`/feedback/${id}`);
            set({ feedback: get().feedback.filter((f) => f._id !== id) });
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete feedback');
        }
    },
}));
