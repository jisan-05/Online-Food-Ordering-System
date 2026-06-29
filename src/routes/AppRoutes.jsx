import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'

const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage'))
const AdminDashboardLayout = lazy(() => import('../layouts/AdminDashboardLayout'))
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))
const AdminFoodsPage = lazy(() => import('../pages/admin/AdminFoodsPage'))
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'))
const CartPage = lazy(() => import('../pages/dashboard/CartPage'))
const CheckoutPage = lazy(() => import('../pages/dashboard/CheckoutPage'))
const CustomerDashboardLayout = lazy(() => import('../layouts/CustomerDashboardLayout'))
const DashboardHomePage = lazy(() => import('../pages/dashboard/DashboardHomePage'))
const WishlistPage = lazy(() => import('../pages/dashboard/WishlistPage'))
const FoodDetailsPage = lazy(() => import('../pages/FoodDetailsPage'))
const FoodsPage = lazy(() => import('../pages/FoodsPage'))
const HomePage = lazy(() => import('../pages/HomePage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const ManageRestaurantsPage = lazy(() => import('../pages/admin/ManageRestaurantsPage'))
const ManageUsersPage = lazy(() => import('../pages/admin/ManageUsersPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const OrderDetailsPage = lazy(() => import('../pages/dashboard/OrderDetailsPage'))
const OrderHistoryPage = lazy(() => import('../pages/dashboard/OrderHistoryPage'))
const OwnerDashboardLayout = lazy(() => import('../layouts/OwnerDashboardLayout'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const AddFoodPage = lazy(() => import('../pages/owner/AddFoodPage'))
const ManageFoodsPage = lazy(() => import('../pages/owner/ManageFoodsPage'))
const ManageOrdersPage = lazy(() => import('../pages/owner/ManageOrdersPage'))
const OwnerAnalyticsPage = lazy(() => import('../pages/owner/OwnerAnalyticsPage'))
const OwnerDashboardPage = lazy(() => import('../pages/owner/OwnerDashboardPage'))

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading page" />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="foods" element={<FoodsPage />} />
          <Route path="foods/:id" element={<FoodDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>
          <Route
            path="owner"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OwnerDashboardPage />} />
            <Route path="add-food" element={<AddFoodPage />} />
            <Route path="foods" element={<ManageFoodsPage />} />
            <Route path="orders" element={<ManageOrdersPage />} />
            <Route path="analytics" element={<OwnerAnalyticsPage />} />
          </Route>
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="restaurants" element={<ManageRestaurantsPage />} />
            <Route path="foods" element={<AdminFoodsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
