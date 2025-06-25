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
import AdminHome from '@/pages/Admin/AdminHome';
import Forbidden from '@/pages/Error/Forbidden';
import ProtectedRoute from './ProtectedRoute';
import Compatibility from '@/pages/BloodCompatibility/BloodCompatibilityPage'
import AccountDashboard from '@/pages/Admin/ManageAccount/AccountDashboard';
import Staffhome from '@/pages/Staff';
import BloodAnalysisEventList from '@/pages/Staff/BloodAnalysis/BloodAnalysisEventList';
import BloodCollectEventList from '@/pages/Staff/BloodCollection/BloodCollectEventList';
import ReceiptEventList from '@/pages/Staff/ManageReceipt/ReceiptEventList';
import DonorLookup from '@/pages/Staff/DonorLookup/DonorLookup';
import BlogContent from '@/pages/Blog/BlogContent';
import Inventory from '@/pages/Staff/BloodInventory/Inventory';
import RoleBaseRedirect from './RoleBaseRedirect';
import AnalyticsDashboard from '@/pages/Admin/ManageData/AnalyticsDashboard';
import AdminSettings from '@/pages/Admin/AdminSetting';
import AdminHelp from '@/pages/Admin/AdminHelp';
import LoginForm from '@/pages/Authentication/LoginForm';
import RegisterForm from '@/pages/Authentication/RegisterForm';
import UserProfile from '@/components/layout/UserProfile';
import OTPForm from '@/pages/Authentication/OTPForm';


// define routes
const routes: RouteObject[] = [
    { path: '/', element: <RoleBaseRedirect />},

    { path: '/home', element: <HomePage /> },

    { path: '/login', element: <LoginForm /> },

    { path: '/otp', element: <OTPForm /> },

    { path: '/register', element: <RegisterForm /> },

    { path: '/bloodinfo', element: <BloodInfoPage /> },

    { path: '/blogs', element: <BlogPage /> },

    { path: '/blogcontent/:id', element: <BlogContent /> },

    { path: '/events', element: <EventPage /> },

    { path: '/profile', element: <UserProfile /> },

    { path: '/compatibility', element: <Compatibility /> },

    {
        path: '/staff', element: (
            <ProtectedRoute element={<Staffhome />} allowRole={["Staff"]} />
        ),
        children: [
            { index: true, element: <Inventory /> },

            { path: 'receipt', element: <ReceiptEventList /> },

            { path: 'bloodcollect', element: <BloodCollectEventList /> },

            { path: 'bloodanalysis', element: <BloodAnalysisEventList /> },

            { path: 'donorsearch', element: <DonorLookup /> }
        ]
    },

    {
        path: '/admin', element: (
            <ProtectedRoute element={<AdminHome />} allowRole={["Admin"]} />
        ), 
        children: [
            {index: true, element: <AccountDashboard/>},

            {path: 'accounts', element: <Navigate to={'/admin'} replace/>},

            {path: 'analytics', element: <AnalyticsDashboard/>},

            {path: 'settings', element: <AdminSettings/>},

            {path: 'help', element: <AdminHelp/>},
        ]
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
