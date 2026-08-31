import LandingPage from './pages/LandingPage.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Notes from './pages/Notes.jsx';
import Quiz from './pages/Quiz.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import SearchResults from './pages/SearchResults.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import NotFound from './pages/NotFound.jsx';
import CreateQuiz from './pages/CreateQuiz.jsx';
import QuizScreen from './pages/QuizScreen.jsx';
import Feedback from './pages/Feedback.jsx';
import RoleGuard from './auth/RoleGuard.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminNotes from './pages/AdminNotes.jsx';
import AdminQuizzes from './pages/AdminQuizzes.jsx';
import AdminFeedback from './pages/AdminFeedback.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

import Navbar from './components/NavBar.jsx';

const routes = [
    // Public routes
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/signin',
        element: <SignIn />,
    },
    {
        path: '/signup',
        element: <SignUp />,
    },
    {
        path: '/privacy',
        element: <PrivacyPolicy />,
    },
    {
        path: '*',
        element: <NotFound />,
    },

    // Protected routes
    {
        element: (
            <Navbar />
        ),
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'notes', element: <Notes /> },
                    { path: 'quizzes', element: <Quiz /> },
                    { path: 'profile', element: <Profile /> },
                    { path: 'settings', element: <Settings /> },
                    { path: 'search', element: <SearchResults /> },
                    {
    element: <RoleGuard allowed={['admin', 'teacher']} />,
    children: [
        { path: 'quizzes/createquiz', element: <CreateQuiz /> },
    ],
},
                    { path: 'quizzes/:quizId', element: <QuizScreen /> },
                    { path: 'feedback', element: <Feedback /> },
                    {
                        element: <RoleGuard allowed={['teacher', 'admin']} />,
                        children: [
                            { path: 'teacher', element: <TeacherDashboard /> },
                        ],
                    },
                    {
                        element: <RoleGuard allowed={['admin']} />,
                        children: [
                            { path: 'admin', element: <AdminDashboard /> },
                            { path: 'admin/users', element: <AdminUsers /> },
                            { path: 'admin/notes', element: <AdminNotes /> },
                            { path: 'admin/quizzes', element: <AdminQuizzes /> },
                            { path: 'admin/feedback', element: <AdminFeedback /> },
                        ],
                    },
                ],
            }]
    },
];

export default routes;
