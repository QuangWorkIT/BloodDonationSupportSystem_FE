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
import AccountDashboard from '@/pages/Admin/AccountDashboard';
import Staffhome from '@/pages/Staff';
import BloodAnalysisEventList from '@/pages/Staff/BloodAnalysis/BloodAnalysisEventList';
import BloodCollectEventList from '@/pages/Staff/BloodCollection/BloodCollectEventList';
import ReceiptEventList from '@/pages/Staff/ManageReceipt/ReceiptEventList';
import StandardReceiptForm from '@/pages/Staff/StandardReceiptRequest/StandardReceiptForm';
import BloodAnalysisForm from '@/pages/Staff/BloodAnalysis/BloodAnalysisForm';
import DonorLookup from '@/pages/Staff/DonorLookup/DonorLookup';


// define routes
const routes: RouteObject[] = [
    { path: '/', element: <HomePage /> },

    { path: '/home', element: <Navigate to={'/'} replace /> },

    { path: '/login', element: <LoginPage /> },

    { path: '/register', element: <RegisterPage /> },

    { path: '/bloodinfo', element: <BloodInfoPage /> },

    { path: '/blogs', element: <BlogPage /> },

    { path: '/events', element: <EventPage /> },

    { path: '/compatibility', element: <Compatibility /> },

    {
        path: '/staff', element: (
            <ProtectedRoute element={<Staffhome />} allowRole={["Staff"]} />
        ),
        children: [
            { index: true, element: <h1>Inventory</h1> },

            { path: 'receipt', element: <ReceiptEventList /> },

            { path: 'bloodcollect', element: <BloodCollectEventList /> },

            { path: 'bloodanalysis', element: <BloodAnalysisEventList /> }
        ]
    },

    {path: '/test', element: <DonorLookup />},
    {
        path: '/admin', element: (
            <ProtectedRoute element={<AdminHome />} allowRole={["admin"]} />
        )
    },

    {
        path: '/admin/accounts', element: (
            <ProtectedRoute element={<AccountDashboard />} allowRole={["admin"]} />
        )
    },

    { path: '/unauthorized', element: <Forbidden /> },

    { path: '*', element: <NotFoundPage /> },
]

// create router object
const router = createBrowserRouter(routes)

function AppRouter() {
    return (
        <RouterProvider router={router}></RouterProvider>
    )
}

export default AppRouter
