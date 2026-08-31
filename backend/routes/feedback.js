import express from 'express';
import VerifyJwtMiddleware from '../middlewares/verifyJWT.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/requireRole.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Submit feedback (students and teachers only - admins manage feedback, not submit it)
router.post('/', VerifyJwtMiddleware, requireRole('student', 'teacher'), async (req, res) => {
    const {
        name,
        email,
        feedbackType,
        rating,
        experience,
        liked,
        improvements,
        newFeatures,
        wouldRecommend,
        additionalComments,
    } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
        const feedback = await Feedback.create({
            user: req.user?._id || req.user?.id || undefined,
            name,
            email,
            feedbackType,
            rating: rating || 0,
            experience: experience || '',
            liked: liked || '',
            improvements: improvements || '',
            newFeatures: newFeatures || '',
            wouldRecommend: wouldRecommend ?? null,
            additionalComments: additionalComments || '',
        });

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// View all feedback (admin only)
router.get('/', VerifyJwtMiddleware, authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 }).populate('user', 'name email');
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete a feedback entry (admin only)
router.delete('/:id', VerifyJwtMiddleware, authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const deleted = await Feedback.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Feedback not found' });
        res.status(200).json({ message: 'Feedback deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;
