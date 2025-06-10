import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
    type RouteObject,
} from 'react-router-dom';

import HomePage from '@/pages/Home/HomePage';
import BloodInfoPage from '@/pages/BloodInfo/BloodInfoPage';
import BlogPage from '@/pages/Blog/BlogPage';
import EventPage from '@/pages/DonationEvent/EventPage';
import NotFoundPage from '@/pages/Error/NotFoundPage';
import LoginPage from '@/pages/Authentication/LoginPage';
import RegisterPage from '@/pages/Authentication/RegisterPage';
import AdminHome from '@/pages/Admin/AdminHome';
import Forbidden from '@/pages/Error/Forbidden';
import ProtectedRoute from './ProtectedRoute';
import Compatibility from '@/pages/BloodCompatibility/BloodCompatibilityPage'


// define routes
const routes: RouteObject[] = [
    { path: '/', element: <HomePage /> },

    { path: '/home', element: <Navigate to={'/'} replace /> },

    { path: '/login', element: <LoginPage /> },

    { path: 'register', element: <RegisterPage /> },

    { path: '/bloodinfo', element: <BloodInfoPage /> },

    { path: '/blogs', element: <BlogPage /> },

    { path: '/events', element: <EventPage /> },

    { path: '/compatibility', element: <Compatibility /> },
    
    {
        path: '/admin', element: (
            <ProtectedRoute element={<AdminHome />} allowRole={["admin"]} />
        )
    },

    { path: '/unauthorized', element: <Forbidden /> },

    { path: '*', element: <NotFoundPage /> },
]

// create router object
const router = createBrowserRouter(routes)

function AppRounter() {
    return (
        <RouterProvider router={router}></RouterProvider>
    )
}

export default AppRounter
